import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle,
  Clock,
  FileText,
  Handshake,
  HeartHandshake,
  Home,
  Landmark,
  Lock,
  MessageCircle,
  Scale,
  ShieldCheck,
  Star,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Accordion } from "@/components/Accordion";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LinkButton, SectionTitle } from "@/components/ui";
import { companyIndicators } from "@/lib/company";

const differentials: [LucideIcon, string][] = [
  [HeartHandshake, "Atendimento personalizado"],
  [BadgeCheck, "Profissionais especializados"],
  [FileText, "Transparência em todas as etapas"],
  [Clock, "Agilidade no atendimento"],
  [ShieldCheck, "Confidencialidade e segurança"],
  [MessageCircle, "Atendimento presencial e online"]
];

const areas: [LucideIcon, string, string][] = [
  [BriefcaseBusiness, "Direito Trabalhista", "Orientação em relações de trabalho, verbas, contratos e conflitos."],
  [Scale, "Direito Civil", "Apoio em contratos, responsabilidade civil, cobranças e obrigações."],
  [Users, "Direito de Família", "Atendimento cuidadoso em divórcio, guarda, alimentos e inventários."],
  [Landmark, "Direito Previdenciário", "Análise de benefícios, revisões e planejamento previdenciário."],
  [ShieldCheck, "Direito do Consumidor", "Defesa em cobranças indevidas, serviços e relações de consumo."],
  [Building2, "Direito Empresarial", "Suporte jurídico para empresas, contratos e rotinas societárias."],
  [Home, "Direito Imobiliário", "Orientação em compra, venda, locação e regularização de imóveis."],
  [Handshake, "Consultoria Jurídica", "Prevenção de riscos e tomada de decisão com base técnica."]
];

const steps = ["Envio da solicitação", "Análise inicial do caso", "Contato com um especialista", "Orientação e acompanhamento"];

// Depoimentos fictícios para demonstração. Substitua por avaliações reais autorizadas antes da publicação.
const testimonials = [
  ["Marina Costa", "Direito de Família", "Recebi orientação clara e acolhedora desde o primeiro contato."],
  ["Carlos Mendes", "Direito Trabalhista", "A equipe explicou cada etapa com transparência e rapidez."],
  ["Patrícia Lima", "Direito do Consumidor", "O atendimento online foi organizado, seguro e muito objetivo."]
];

const faqs = [
  ["A primeira avaliação possui custo?", "A política de cobrança deve ser confirmada com a equipe no primeiro contato, sem promessas de resultado jurídico."],
  ["O atendimento pode ser realizado online?", "Sim. O atendimento pode ocorrer por WhatsApp, telefone, e-mail ou videoconferência, conforme a preferência indicada."],
  ["Quais documentos devo enviar?", "Envie documentos relacionados ao caso, como contratos, notificações, comprovantes, decisões, mensagens ou documentos pessoais quando necessário."],
  ["Quanto tempo leva para receber um retorno?", "O prazo de retorno é configurável pela empresa e deve ser informado conforme a operação real do escritório."],
  ["Meus dados estarão protegidos?", "Os dados são utilizados exclusivamente para análise e contato relacionado à solicitação, conforme a Política de Privacidade."],
  ["A empresa atende clientes de outras cidades?", "Sim, o atendimento pode ser presencial ou online, permitindo suporte a clientes de diferentes localidades."]
].map(([question, answer]) => ({ question, answer }));

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section id="inicio" className="bg-white">
          <div className="container-page grid min-h-[calc(100vh-80px)] items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gold-500">Atendimento jurídico humanizado</p>
              <h1 className="text-4xl font-bold leading-tight text-navy-900 md:text-6xl">Assistência jurídica com segurança, transparência e compromisso.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Orientação jurídica personalizada para pessoas físicas e empresas, com análise responsável, comunicação clara e cuidado em cada etapa.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LinkButton href="/atendimento">Solicitar atendimento</LinkButton>
                <LinkButton href="#areas" variant="secondary">Conhecer nossos serviços</LinkButton>
              </div>
            </div>
            <div className="relative">
              <img
                className="aspect-[4/3] w-full rounded-lg object-cover shadow-soft"
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80"
                alt="Mesa de trabalho com documentos jurídicos em ambiente corporativo"
              />
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-page">
            <SectionTitle title="Diferenciais que sustentam uma orientação segura" />
            <div className="grid gap-5 md:grid-cols-3">
              {differentials.map(([Icon, title]) => (
                <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft" key={String(title)}>
                  <Icon className="text-gold-500" aria-hidden />
                  <h3 className="mt-4 font-semibold text-navy-900">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="sobre" className="bg-white py-16">
          <div className="container-page grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gold-500">Sobre a empresa</p>
              <h2 className="mt-2 text-3xl font-bold text-navy-900">Orientação acessível, humanizada e eficiente.</h2>
              <p className="mt-5 leading-8 text-slate-600">
                A F&G Assistência Jurídica nasceu com o propósito de oferecer orientação jurídica acessível, humanizada e eficiente. Nossa equipe atua de forma estratégica, buscando compreender cada situação e apresentar soluções claras e seguras.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {companyIndicators.map((indicator) => (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5" key={indicator}>
                  <CheckCircle className="text-gold-500" aria-hidden />
                  <p className="mt-3 font-semibold text-navy-900">{indicator}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="areas" className="py-16">
          <div className="container-page">
            <SectionTitle eyebrow="Áreas de atuação" title="Apoio jurídico para diferentes necessidades" />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {areas.map(([Icon, title, description]) => (
                <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={String(title)}>
                  <Icon className="text-gold-500" aria-hidden />
                  <h3 className="mt-4 font-semibold text-navy-900">{title}</h3>
                  <p className="mt-2 min-h-20 text-sm leading-6 text-slate-600">{description}</p>
                  <a className="mt-4 inline-flex font-semibold text-navy-800 underline" href="/atendimento">Saiba mais</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="bg-white py-16">
          <div className="container-page">
            <SectionTitle title="Como funciona" text="Um fluxo simples para registrar a demanda, analisar as informações e iniciar o contato com segurança." />
            <div className="grid gap-5 md:grid-cols-4">
              {steps.map((step, index) => (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5" key={step}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-800 font-bold text-white">{index + 1}</span>
                  <h3 className="mt-4 font-semibold text-navy-900">{step}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="depoimentos" className="py-16">
          <div className="container-page">
            <SectionTitle title="Depoimentos demonstrativos" text="Exemplos fictícios de experiência de atendimento para ilustrar o layout." />
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map(([name, area, text]) => (
                <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" key={name}>
                  <div className="flex text-gold-500">{Array.from({ length: 5 }).map((_, index) => <Star fill="currentColor" size={18} key={index} aria-hidden />)}</div>
                  <p className="mt-4 leading-7 text-slate-700">“{text}”</p>
                  <p className="mt-4 font-semibold text-navy-900">{name}</p>
                  <p className="text-sm text-slate-500">{area}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-white py-16">
          <div className="container-page">
            <SectionTitle title="Perguntas frequentes" />
            <Accordion items={faqs} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
