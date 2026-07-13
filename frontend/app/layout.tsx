import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: " F&G Assistência Jurídica",
  description: "Assistência jurídica com segurança, transparência e compromisso."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

