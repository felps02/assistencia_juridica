"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { CheckCircle, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { requestSchema, type RequestFormData } from "@/schemas/request-schema";
import { api } from "@/services/api";
import type { ApiResponse } from "@/types/api";
import { contactPreferenceOptions, customerTypeOptions, legalAreaOptions } from "@/lib/options";
import { Button, Field, Input, Select, Textarea } from "./ui";

export function RequestForm() {
  const [protocol, setProtocol] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: { consentAccepted: false }
  });

  async function onSubmit(data: RequestFormData) {
    setFormError("");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "documents" && value !== undefined) formData.append(key, String(value));
    });
    Array.from(data.documents ?? []).forEach((file) => formData.append("documents", file));

    try {
      const response = await api.post<ApiResponse<{ id: string; protocol: string }>>("/legal-requests", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProtocol(response.data.data.protocol);
      reset();
    } catch (error) {
      const apiError = error as AxiosError<ApiResponse<unknown>>;
      const validationErrors = apiError.response?.data.errors;
      if (validationErrors?.length) {
        validationErrors.forEach((item) => setError(item.field as keyof RequestFormData, { message: item.message }));
      } else {
        setFormError(apiError.response?.data.message || "Não foi possível enviar a solicitação. Tente novamente.");
      }
    }
  }

  if (protocol) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
        <CheckCircle className="mb-3" aria-hidden />
        <h2 className="text-2xl font-bold">Solicitação enviada com sucesso.</h2>
        <p className="mt-2">Seu protocolo é <strong>{protocol}</strong>. Enviaremos a confirmação por e-mail quando o SMTP estiver configurado.</p>
        <Button className="mt-5" onClick={() => setProtocol(null)}>Enviar nova solicitação</Button>
      </div>
    );
  }

  return (
    <form className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-soft md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <Field label="Nome completo" error={errors.fullName?.message}><Input {...register("fullName")} /></Field>
      <Field label="E-mail" error={errors.email?.message}><Input type="email" {...register("email")} /></Field>
      <Field label="Telefone" error={errors.phone?.message}><Input {...register("phone")} /></Field>
      <Field label="CPF ou CNPJ (opcional)" error={errors.document?.message}><Input {...register("document")} /></Field>
      <Field label="Cidade" error={errors.city?.message}><Input {...register("city")} /></Field>
      <Field label="Estado" error={errors.state?.message}><Input maxLength={2} placeholder="SP" {...register("state")} /></Field>
      <Field label="Tipo de atendimento" error={errors.customerType?.message}>
        <Select defaultValue="" {...register("customerType")}>
          <option value="" disabled>Selecione</option>
          {customerTypeOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
        </Select>
      </Field>
      <Field label="Área jurídica" error={errors.legalArea?.message}>
        <Select defaultValue="" {...register("legalArea")}>
          <option value="" disabled>Selecione</option>
          {legalAreaOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
        </Select>
      </Field>
      <Field label="Preferência de contato" error={errors.contactPreference?.message}>
        <Select defaultValue="" {...register("contactPreference")}>
          <option value="" disabled>Selecione</option>
          {contactPreferenceOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
        </Select>
      </Field>
      <Field label="Melhor horário para contato" error={errors.preferredContactTime?.message}><Input {...register("preferredContactTime")} /></Field>
      <div className="md:col-span-2">
        <Field label="Descrição do caso" error={errors.caseDescription?.message}><Textarea rows={6} {...register("caseDescription")} /></Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Upload de documentos" error={errors.documents?.message}>
          <span className="flex items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
            <Upload size={18} aria-hidden />
            <Input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" {...register("documents")} />
          </span>
        </Field>
        <p className="mt-2 text-xs text-slate-500">Formatos permitidos: PDF, JPG, JPEG, PNG, DOC e DOCX. Limite de 10 MB por arquivo.</p>
      </div>
      <div className="md:col-span-2">
        <label className="flex gap-3 text-sm text-slate-700">
          <input className="mt-1 h-4 w-4" type="checkbox" {...register("consentAccepted")} />
          <span>Declaro que li e concordo com a <Link className="font-semibold text-navy-800 underline" href="/politica-de-privacidade">Política de Privacidade</Link> e autorizo o uso dos meus dados para fins de atendimento.</span>
        </label>
        {errors.consentAccepted && <p className="mt-1 text-sm text-red-700">{errors.consentAccepted.message}</p>}
      </div>
      {formError && <p className="md:col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
      <div className="md:col-span-2">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Loader2 className="animate-spin" size={18} aria-hidden />}
          Solicitar análise
        </Button>
      </div>
    </form>
  );
}

