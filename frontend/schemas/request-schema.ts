import { z } from "zod";

const validDocument = (value?: string) => {
  if (!value) return true;
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 || digits.length === 14;
};

export const requestSchema = z.object({
  fullName: z.string().min(2, "Nome obrigatório."),
  email: z.string().email("Informe um e-mail válido."),
  phone: z.string().min(8, "Telefone obrigatório."),
  document: z.string().optional().refine(validDocument, "Informe um CPF ou CNPJ válido."),
  city: z.string().min(2, "Cidade obrigatória."),
  state: z.string().min(2, "Estado obrigatório."),
  customerType: z.string().min(1, "Tipo de atendimento obrigatório."),
  legalArea: z.string().min(1, "Área jurídica obrigatória."),
  contactPreference: z.string().min(1, "Preferência de contato obrigatória."),
  preferredContactTime: z.string().optional(),
  caseDescription: z.string().min(30, "Descreva o caso com pelo menos 30 caracteres."),
  consentAccepted: z.boolean().refine(Boolean, "A autorização é obrigatória."),
  documents: z
    .custom<FileList>()
    .optional()
    .refine((files) => !files || Array.from(files).every((file) => file.size <= 10 * 1024 * 1024), "Cada arquivo deve ter no máximo 10 MB.")
    .refine((files) => {
      if (!files) return true;
      const allowed = ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      return Array.from(files).every((file) => allowed.includes(file.type));
    }, "Envie apenas PDF, JPG, JPEG, PNG, DOC ou DOCX.")
});

export type RequestFormData = z.infer<typeof requestSchema>;

