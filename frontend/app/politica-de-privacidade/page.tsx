import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="container-page py-12">
        <article className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-navy-900">Política de Privacidade</h1>
          <div className="mt-6 space-y-4 leading-7 text-slate-700">
            <p>Os dados enviados pelo formulário são utilizados exclusivamente para análise inicial e contato relacionado à solicitação de atendimento.</p>
            <p>Podemos registrar nome, e-mail, telefone, localidade, descrição do caso, documentos enviados, data e hora do consentimento, IP e User-Agent quando disponíveis.</p>
            <p>O acesso administrativo é restrito a usuários autorizados. Não vendemos dados pessoais e não fazemos promessas de resultado jurídico.</p>
            <p>Para solicitar atualização ou exclusão de dados, entre em contato pelos canais informados no rodapé.</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

