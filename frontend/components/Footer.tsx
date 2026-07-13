import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { company } from "@/lib/company";

const areas = ["Trabalhista", "Civil", "Família", "Previdenciário", "Consumidor", "Empresarial"];

export function Footer() {
  return (
    <footer id="contato" className="bg-navy-900 text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div>
          <h2 className="text-lg font-bold">{company.name}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Atendimento jurídico humanizado, transparente e orientado por segurança em cada etapa.
          </p>
          <div className="mt-5 flex gap-3">
            <a aria-label="Instagram" className="rounded-lg bg-white/10 p-2 hover:bg-white/20" href={company.socials.instagram}><Instagram size={18} /></a>
            <a aria-label="LinkedIn" className="rounded-lg bg-white/10 p-2 hover:bg-white/20" href={company.socials.linkedin}><Linkedin size={18} /></a>
            <a aria-label="Facebook" className="rounded-lg bg-white/10 p-2 hover:bg-white/20" href={company.socials.facebook}><Facebook size={18} /></a>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gold-400">Contato</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li className="flex gap-2"><Phone size={16} /> {company.phone}</li>
            <li className="flex gap-2"><Phone size={16} /> WhatsApp: {company.whatsapp}</li>
            <li className="flex gap-2"><Mail size={16} /> {company.email}</li>
            <li className="flex gap-2"><MapPin size={16} /> {company.address}</li>
            <li>{company.hours}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gold-400">Links rápidos</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li><Link href="/atendimento">Solicitar atendimento</Link></li>
            <li><Link href="/#sobre">Sobre</Link></li>
            <li><Link href="/#faq">Perguntas frequentes</Link></li>
            <li><Link href="/politica-de-privacidade">Política de Privacidade</Link></li>
            <li><Link href="/termos-de-uso">Termos de Uso</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gold-400">Áreas de atuação</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {areas.map((area) => <li key={area}>{area}</li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} {company.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}

