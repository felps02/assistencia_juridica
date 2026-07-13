import { Prisma } from "@prisma/client";
import { legalRequestRepository } from "../repositories/legal-request.repository.js";
import { makeStorageProvider } from "../storage/index.js";
import { AppError } from "../utils/app-error.js";
import { buildProtocol, extractProtocolSequence } from "../utils/protocol.js";
import { sanitizeString } from "../utils/sanitize.js";
import { mailService } from "./mail.service.js";

type CreateLegalRequestInput = {
  fullName: string;
  email: string;
  phone: string;
  document?: string;
  city: string;
  state: string;
  customerType: "PERSON" | "COMPANY";
  legalArea: "LABOR" | "CIVIL" | "FAMILY" | "SOCIAL_SECURITY" | "CONSUMER" | "BUSINESS" | "REAL_ESTATE" | "OTHER";
  contactPreference: "WHATSAPP" | "PHONE" | "EMAIL" | "VIDEO_CALL";
  preferredContactTime?: string;
  caseDescription: string;
  consentAccepted: boolean;
};

async function nextProtocol() {
  const year = new Date().getFullYear();
  const latest = await legalRequestRepository.findLatestProtocolForYear(year);
  return buildProtocol(year, extractProtocolSequence(latest?.protocol) + 1);
}

export const legalRequestService = {
  async create(data: CreateLegalRequestInput, files: Express.Multer.File[], metadata: { ipAddress?: string; userAgent?: string }) {
    const storage = makeStorageProvider();
    const attachments = await Promise.all(files.map((file) => storage.save(file)));

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const protocol = await nextProtocol();
      try {
        const request = await legalRequestRepository.create({
          protocol,
          fullName: sanitizeString(data.fullName),
          email: data.email.toLowerCase(),
          phone: sanitizeString(data.phone),
          document: data.document ? sanitizeString(data.document) : undefined,
          city: sanitizeString(data.city),
          state: sanitizeString(data.state).toUpperCase(),
          customerType: data.customerType,
          legalArea: data.legalArea,
          contactPreference: data.contactPreference,
          preferredContactTime: data.preferredContactTime ? sanitizeString(data.preferredContactTime) : undefined,
          caseDescription: sanitizeString(data.caseDescription),
          consentAccepted: data.consentAccepted,
          consentAcceptedAt: new Date(),
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
          attachments: { create: attachments },
          histories: { create: { newStatus: "NEW" } }
        });

        mailService.sendLegalRequestEmails({
          fullName: request.fullName,
          email: request.email,
          protocol: request.protocol,
          legalArea: request.legalArea,
          createdAt: request.createdAt
        }).catch((error) => console.error("Email delivery failed", error.message));

        return { id: request.id, protocol: request.protocol };
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") continue;
        throw error;
      }
    }
    throw new AppError("Não foi possível gerar um protocolo único.", 500);
  },

  async list(filters: Parameters<typeof legalRequestRepository.list>[0]) {
    const [total, items] = await legalRequestRepository.list(filters);
    return {
      items,
      meta: {
        total,
        page: filters.page,
        perPage: filters.perPage,
        totalPages: Math.ceil(total / filters.perPage)
      }
    };
  },

  async findById(id: string) {
    const request = await legalRequestRepository.findById(id);
    if (!request) throw new AppError("Solicitação não encontrada.", 404);
    return request;
  },

  updateStatus(id: string, userId: string, status: Parameters<typeof legalRequestRepository.updateStatus>[2]) {
    return legalRequestRepository.updateStatus(id, userId, status);
  },

  createNote(id: string, userId: string, content: string) {
    return legalRequestRepository.createNote(id, userId, sanitizeString(content));
  },

  listNotes(id: string) {
    return legalRequestRepository.listNotes(id);
  },

  listHistory(id: string) {
    return legalRequestRepository.listHistory(id);
  }
};

