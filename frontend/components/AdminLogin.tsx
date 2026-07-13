"use client";

import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { api } from "@/services/api";
import type { ApiResponse } from "@/types/api";
import { Button, Field, Input } from "./ui";

export function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post<ApiResponse<{ token: string }>>("/auth/login", { email, password });
      onLogin(response.data.data.token);
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <form className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft" onSubmit={submit}>
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-lg bg-navy-800 p-3 text-gold-400"><Lock aria-hidden /></span>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Painel administrativo</h1>
            <p className="text-sm text-slate-600">Acesso restrito à equipe autorizada.</p>
          </div>
        </div>
        <div className="space-y-4">
          <Field label="E-mail"><Input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
          <Field label="Senha">
            <span className="flex rounded-lg border border-slate-300 bg-white shadow-sm">
              <input className="focus-ring min-w-0 flex-1 rounded-l-lg px-3 py-2.5" required type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} />
              <button className="focus-ring rounded-r-lg px-3 text-slate-600" type="button" onClick={() => setShow((value) => !value)} aria-label={show ? "Ocultar senha" : "Mostrar senha"}>
                {show ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
              </button>
            </span>
          </Field>
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <Button className="w-full" disabled={loading} type="submit">
            {loading && <Loader2 className="animate-spin" size={18} aria-hidden />}
            Entrar
          </Button>
        </div>
      </form>
    </main>
  );
}

