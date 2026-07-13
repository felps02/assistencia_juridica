import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="container-page py-12">
        <article className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-navy-900">Termos de Uso</h1>
          <div className="mt-6 space-y-4 leading-7 text-slate-700">
            <p>Este site permite o envio de solicitações para avaliação de atendimento jurídico. O envio de informações não cria automaticamente relação contratual.</p>
            <p>As informações fornecidas devem ser verdadeiras e os documentos enviados devem estar relacionados ao caso apresentado.</p>
            <p>A F&G Assistência Jurídica Assistência Jurídica não garante resultado jurídico específico. Cada situação depende de análise técnica, documentos e legislação aplicável.</p>
            <p>O uso indevido do formulário, envio de arquivos maliciosos ou tentativa de acesso não autorizado poderá resultar em bloqueio e medidas cabíveis.</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

