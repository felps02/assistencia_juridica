import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RequestForm } from "@/components/RequestForm";

export default function AtendimentoPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-100 py-12">
        <div className="container-page">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-500">Solicitação de atendimento</p>
            <h1 className="mt-2 text-4xl font-bold text-navy-900">Conte-nos sobre sua necessidade jurídica.</h1>
            <p className="mt-4 leading-7 text-slate-600">
              Os dados serão utilizados exclusivamente para análise e contato relacionado à solicitação. O envio do formulário não representa promessa de resultado jurídico.
            </p>
          </div>
          <RequestForm />
        </div>
      </main>
      <Footer />
    </>
  );
}

