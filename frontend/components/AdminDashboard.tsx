"use client";

import { Filter, LogOut, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { labelFor, legalAreaOptions, statusOptions } from "@/lib/options";
import { api } from "@/services/api";
import type { ApiResponse, LegalRequest } from "@/types/api";
import { StatusBadge } from "./StatusBadge";
import { Button, Field, Input, Select } from "./ui";

type Metrics = {
  total: number;
  new: number;
  underReview: number;
  inProgress: number;
  completed: number;
  byArea: { legalArea: string; total: number }[];
  byState: { state: string; total: number }[];
  last30Days: Record<string, number>;
};

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [requests, setRequests] = useState<LegalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", legalArea: "", state: "", name: "", protocol: "", startDate: "", endDate: "" });
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const [metricsResponse, requestsResponse] = await Promise.all([
        api.get<ApiResponse<Metrics>>("/dashboard/metrics"),
        api.get<ApiResponse<{ items: LegalRequest[] }>>("/legal-requests", { params })
      ]);
      setMetrics(metricsResponse.data.data);
      setRequests(requestsResponse.data.data.items);
    } catch {
      setError("Não foi possível carregar o painel.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="container-page flex min-h-16 items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-navy-900">Painel administrativo</h1>
            <p className="text-sm text-slate-600">Solicitações, métricas e acompanhamento interno.</p>
          </div>
          <Button variant="ghost" onClick={onLogout}><LogOut size={18} aria-hidden /> Sair</Button>
        </div>
      </header>

      <section className="container-page py-8">
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
        <div className="grid gap-4 md:grid-cols-5">
          {[
            ["Total", metrics?.total ?? 0],
            ["Novas", metrics?.new ?? 0],
            ["Em análise", metrics?.underReview ?? 0],
            ["Em andamento", metrics?.inProgress ?? 0],
            ["Concluídas", metrics?.completed ?? 0]
          ].map(([label, value]) => (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={label}>
              <p className="text-sm text-slate-600">{label}</p>
              <p className="mt-2 text-3xl font-bold text-navy-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-navy-900">Solicitações por área</h2>
            <div className="mt-4 space-y-2 text-sm">
              {metrics?.byArea.length ? metrics.byArea.map((item) => <p className="flex justify-between" key={item.legalArea}><span>{labelFor(legalAreaOptions, item.legalArea)}</span><strong>{item.total}</strong></p>) : <p className="text-slate-500">Sem dados.</p>}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-navy-900">Solicitações por estado</h2>
            <div className="mt-4 space-y-2 text-sm">
              {metrics?.byState.length ? metrics.byState.map((item) => <p className="flex justify-between" key={item.state}><span>{item.state}</span><strong>{item.total}</strong></p>) : <p className="text-slate-500">Sem dados.</p>}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-navy-900">Últimos 30 dias</h2>
            <p className="mt-4 text-3xl font-bold text-navy-900">{Object.values(metrics?.last30Days ?? {}).reduce((sum, value) => sum + value, 0)}</p>
            <p className="text-sm text-slate-600">solicitações recebidas no período</p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-semibold text-navy-900"><Filter size={18} aria-hidden /> Filtros</h2>
            <Button variant="secondary" onClick={load}><RefreshCw size={18} aria-hidden /> Atualizar</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Status"><Select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">Todos</option>{statusOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</Select></Field>
            <Field label="Área jurídica"><Select value={filters.legalArea} onChange={(event) => setFilters({ ...filters, legalArea: event.target.value })}><option value="">Todas</option>{legalAreaOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</Select></Field>
            <Field label="Estado"><Input value={filters.state} onChange={(event) => setFilters({ ...filters, state: event.target.value })} /></Field>
            <Field label="Nome"><Input value={filters.name} onChange={(event) => setFilters({ ...filters, name: event.target.value })} /></Field>
            <Field label="Protocolo"><Input value={filters.protocol} onChange={(event) => setFilters({ ...filters, protocol: event.target.value })} /></Field>
            <Field label="Data inicial"><Input type="date" value={filters.startDate} onChange={(event) => setFilters({ ...filters, startDate: event.target.value })} /></Field>
            <Field label="Data final"><Input type="date" value={filters.endDate} onChange={(event) => setFilters({ ...filters, endDate: event.target.value })} /></Field>
            <div className="flex items-end"><Button className="w-full" onClick={load}><Search size={18} aria-hidden /> Buscar</Button></div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {["Protocolo", "Nome", "Telefone", "E-mail", "Área", "Cidade", "UF", "Status", "Data", "Ações"].map((heading) => <th className="px-4 py-3 font-semibold" key={heading}>{heading}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td className="px-4 py-8 text-center text-slate-500" colSpan={10}>Carregando solicitações...</td></tr>
                ) : requests.length ? requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-4 py-3 font-semibold text-navy-800">{request.protocol}</td>
                    <td className="px-4 py-3">{request.fullName}</td>
                    <td className="px-4 py-3">{request.phone}</td>
                    <td className="px-4 py-3">{request.email}</td>
                    <td className="px-4 py-3">{labelFor(legalAreaOptions, request.legalArea)}</td>
                    <td className="px-4 py-3">{request.city}</td>
                    <td className="px-4 py-3">{request.state}</td>
                    <td className="px-4 py-3"><StatusBadge status={request.status} /></td>
                    <td className="px-4 py-3">{new Date(request.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3"><Link className="font-semibold text-navy-800 underline" href={`/admin/solicitacoes/${request.id}`}>Detalhes</Link></td>
                  </tr>
                )) : (
                  <tr><td className="px-4 py-8 text-center text-slate-500" colSpan={10}>Nenhuma solicitação encontrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

