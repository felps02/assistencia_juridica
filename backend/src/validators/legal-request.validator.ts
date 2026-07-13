import { ContactPreference, CustomerType, LegalArea, RequestStatus } from "@prisma/client";
import { z } from "zod";
import { isValidCpfOrCnpj, paginationSchema } from "./common.js";

export const createLegalRequestSchema = z.object({
  fullName: z.string().min(2, "Nome obrigatório."),
  email: z.string().email("Informe um e-mail válido."),
  phone: z.string().min(8, "Telefone obrigatório."),
  document: z.string().optional().transform((value) => value?.trim() || undefined),
  city: z.string().min(2, "Cidade obrigatória."),
  state: z.string().min(2, "Estado obrigatório."),
  customerType: z.nativeEnum(CustomerType, { required_error: "Tipo de atendimento obrigatório." }),
  legalArea: z.nativeEnum(LegalArea, { required_error: "Área jurídica obrigatória." }),
  contactPreference: z.nativeEnum(ContactPreference, { required_error: "Preferência de contato obrigatória." }),
  preferredContactTime: z.string().optional(),
  caseDescription: z.string().min(30, "Descreva o caso com pelo menos 30 caracteres."),
  consentAccepted: z.coerce.boolean().refine((value) => value, "A autorização para tratamento dos dados é obrigatória.")
}).superRefine((data, ctx) => {
  if (data.document && !isValidCpfOrCnpj(data.document)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["document"], message: "Informe um CPF ou CNPJ válido." });
  }
});

export const legalRequestFiltersSchema = paginationSchema.extend({
  status: z.nativeEnum(RequestStatus).optional(),
  legalArea: z.nativeEnum(LegalArea).optional(),
  state: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  name: z.string().optional(),
  protocol: z.string().optional()
});

export const updateStatusSchema = z.object({
  status: z.nativeEnum(RequestStatus)
});

export const createNoteSchema = z.object({
  content: z.string().min(3, "Informe a observação.")
});

