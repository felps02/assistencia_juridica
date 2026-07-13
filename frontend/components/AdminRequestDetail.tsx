"use client";

import { ArrowLeft, FileText, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { labelFor, contactPreferenceOptions, customerTypeOptions, legalAreaOptions, statusOptions } from "@/lib/options";
import { api, apiOrigin } from "@/services/api";
import type { ApiResponse, LegalRequest } from "@/types/api";
import { StatusBadge } from "./StatusBadge";
import { Button, Select, Textarea } from "./ui";

export function AdminRequestDetail({ id }: { id: string }) {
  const [request, setRequest] = useState<LegalRequest | null>(null);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const response = await api.get<ApiResponse<LegalRequest>>(`/legal-requests/${id}`);
    setRequest(response.data.data);
    setStatus(response.data.data.status);
    setLoading(false);
  }

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, [id]);

  async function updateStatus() {
    setSaving(true);
    await api.patch(`/legal-requests/${id}/status`, { status });
    await load();
    setSaving(false);
  }

  async function saveNote() {
    if (!note.trim()) return;
    setSaving(true);
    await api.post(`/legal-requests/${id}/notes`, { content: note });
    setNote("");
    await load();
    setSaving(false);
  }

  if (loading) return <main className="container-page py-12">Carregando detalhes...</main>;
  if (!request) return <main className="container-page py-12">Solicitação não encontrada.</main>;

  return (
    <main className="min-h-screen bg-slate-100 py-8">
      <div className="container-page">
        <Link className="mb-5 inline-flex items-center gap-2 font-semibold text-navy-800" href="/admin"><ArrowLeft size={18} /> Voltar ao painel</Link>
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-600">Protocolo</p>
              <h1 className="text-3xl font-bold text-navy-900">{request.protocol}</h1>
              <p className="mt-1 text-slate-600">Criada em {new Date(request.createdAt).toLocaleString("pt-BR")}</p>
            </div>
            <StatusBadge status={request.status} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="space-y-6">
            <InfoCard title="Dados pessoais" rows={[
              ["Nome", request.fullName],
              ["E-mail", request.email],
              ["Telefone", request.phone],
              ["CPF/CNPJ", request.document || "Não informado"],
              ["Cidade/Estado", `${request.city} - ${request.state}`]
            ]} />
            <InfoCard title="Informações do atendimento" rows={[
              ["Tipo", labelFor(customerTypeOptions, request.customerType)],
              ["Área jurídica", labelFor(legalAreaOptions, request.legalArea)],
              ["Preferência de contato", labelFor(contactPreferenceOptions, request.contactPreference)],
              ["Melhor horário", request.preferredContactTime || "Não informado"]
            ]} />
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-navy-900">Descrição do caso</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{request.caseDescription}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-navy-900">Documentos anexados</h2>
              <div className="mt-3 space-y-2">
                {request.attachments.length ? request.attachments.map((file) => (
                  <a className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm font-medium text-navy-800" href={file.fileUrl.startsWith("http") ? file.fileUrl : `${apiOrigin}${file.fileUrl}`} key={file.id} target="_blank">
                    <FileText size={18} aria-hidden /> {file.originalName}
                  </a>
                )) : <p className="text-sm text-slate-500">Nenhum documento anexado.</p>}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-navy-900">Alteração de status</h2>
              <Select className="mt-3" value={status} onChange={(event) => setStatus(event.target.value)}>
                {statusOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
              </Select>
              <Button className="mt-3 w-full" disabled={saving} onClick={updateStatus}>
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Salvar status
              </Button>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-navy-900">Observações internas</h2>
              <Textarea className="mt-3" rows={4} value={note} onChange={(event) => setNote(event.target.value)} />
              <Button className="mt-3 w-full" disabled={saving} onClick={saveNote}>Adicionar observação</Button>
              <div className="mt-4 space-y-3">
                {request.notes?.length ? request.notes.map((item) => (
                  <div className="rounded-lg bg-slate-50 p-3 text-sm" key={item.id}>
                    <p className="text-slate-700">{item.content}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.user.name} - {new Date(item.createdAt).toLocaleString("pt-BR")}</p>
                  </div>
                )) : <p className="text-sm text-slate-500">Sem observações.</p>}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-navy-900">Histórico de alterações</h2>
              <div className="mt-4 space-y-3">
                {request.histories?.length ? request.histories.map((item) => (
                  <div className="rounded-lg bg-slate-50 p-3 text-sm" key={item.id}>
                    <p>{item.previousStatus ? labelFor(statusOptions, item.previousStatus) : "Criação"} → {labelFor(statusOptions, item.newStatus)}</p>
                    <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString("pt-BR")}</p>
                  </div>
                )) : <p className="text-sm text-slate-500">Sem histórico.</p>}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoCard({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-navy-900">{title}</h2>
      <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-medium text-navy-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
