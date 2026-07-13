import nodemailer from "nodemailer";
import { env } from "../config/env.js";

type ConfirmationParams = {
  fullName: string;
  email: string;
  protocol: string;
  legalArea: string;
  createdAt: Date;
};

function getTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_FROM) return null;
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined
  });
}

export const mailService = {
  async sendLegalRequestEmails(params: ConfirmationParams) {
    const transporter = getTransporter();
    if (!transporter) return;

    const responseTime = process.env.CONTACT_RESPONSE_TIME || "até 1 dia útil";
    const sentAt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(params.createdAt);

    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: params.email,
      subject: `Solicitação recebida - Protocolo ${params.protocol}`,
      text: [
        `Olá, ${params.fullName}.`,
        `Recebemos sua solicitação de atendimento jurídico.`,
        `Protocolo: ${params.protocol}`,
        `Área jurídica: ${params.legalArea}`,
        `Data do envio: ${sentAt}`,
        `Prazo estimado para contato: ${responseTime}.`,
        "Seus dados serão utilizados exclusivamente para análise e contato relacionado à solicitação."
      ].join("\n")
    });

    if (env.ADMIN_NOTIFICATION_EMAIL) {
      await transporter.sendMail({
        from: env.SMTP_FROM,
        to: env.ADMIN_NOTIFICATION_EMAIL,
        subject: `Nova solicitação jurídica - ${params.protocol}`,
        text: `Nova solicitação recebida.\nNome: ${params.fullName}\nE-mail: ${params.email}\nÁrea: ${params.legalArea}\nProtocolo: ${params.protocol}`
      });
    }
  }
};

