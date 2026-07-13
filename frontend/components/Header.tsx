"use client";

import { Menu, Scale, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { company } from "@/lib/company";
import { LinkButton } from "./ui";

const links = [
  ["Início", "/#inicio"],
  ["Sobre", "/#sobre"],
  ["Áreas de atuação", "/#areas"],
  ["Como funciona", "/#como-funciona"],
  ["Depoimentos", "/#depoimentos"],
  ["Perguntas frequentes", "/#faq"],
  ["Contato", "/#contato"]
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-lg">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-800 text-gold-400">
            <Scale size={24} aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-semibold text-navy-900">{company.shortName}</span>
            <span className="block text-xs text-slate-600">Assistência Jurídica</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 lg:flex">
          {links.map(([label, href]) => (
            <a className="focus-ring rounded-md hover:text-navy-900" href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <LinkButton href="/atendimento">Solicitar atendimento</LinkButton>
        </div>

        <button className="focus-ring rounded-lg p-2 text-navy-900 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Abrir menu">
          {open ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-2 py-4 text-sm font-medium">
            {links.map(([label, href]) => (
              <a className="rounded-lg px-2 py-2 text-slate-700 hover:bg-navy-50" href={href} key={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <a className="mt-2 rounded-lg bg-navy-800 px-4 py-3 text-center font-semibold text-white" href="/atendimento">
              Solicitar atendimento
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

