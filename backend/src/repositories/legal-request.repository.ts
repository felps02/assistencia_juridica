import { LegalArea, Prisma, RequestStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export type LegalRequestFilters = {
  page: number;
  perPage: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  status?: RequestStatus;
  legalArea?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  name?: string;
  protocol?: string;
};

function makeWhere(filters: LegalRequestFilters): Prisma.LegalRequestWhereInput {
  const where: Prisma.LegalRequestWhereInput = {};
  if (filters.status) where.status = filters.status;
  if (filters.legalArea) where.legalArea = filters.legalArea as LegalArea;
  if (filters.state) where.state = { contains: filters.state };
  if (filters.name) where.fullName = { contains: filters.name };
  if (filters.protocol) where.protocol = { contains: filters.protocol };
  if (filters.startDate || filters.endDate) {
    where.createdAt = {
      ...(filters.startDate ? { gte: new Date(filters.startDate) } : {}),
      ...(filters.endDate ? { lte: new Date(filters.endDate) } : {})
    };
  }
  return where;
}

export const legalRequestRepository = {
  findLatestProtocolForYear(year: number) {
    return prisma.legalRequest.findFirst({
      where: { protocol: { startsWith: `AJ-${year}-` } },
      orderBy: { protocol: "desc" },
      select: { protocol: true }
    });
  },

  create(data: Prisma.LegalRequestCreateInput) {
    return prisma.legalRequest.create({
      data,
      include: { attachments: true }
    });
  },

  list(filters: LegalRequestFilters) {
    const where = makeWhere(filters);
    const skip = (filters.page - 1) * filters.perPage;
    const orderBy = { [filters.sortBy]: filters.sortOrder } as Prisma.LegalRequestOrderByWithRelationInput;
    return prisma.$transaction([
      prisma.legalRequest.count({ where }),
      prisma.legalRequest.findMany({
        where,
        skip,
        take: filters.perPage,
        orderBy,
        include: { attachments: true }
      })
    ]);
  },

  findById(id: string) {
    return prisma.legalRequest.findUnique({
      where: { id },
      include: {
        attachments: true,
        notes: { include: { user: { select: { id: true, name: true, email: true, role: true } } }, orderBy: { createdAt: "desc" } },
        histories: { include: { user: { select: { id: true, name: true, email: true, role: true } } }, orderBy: { createdAt: "desc" } }
      }
    });
  },

  async updateStatus(id: string, userId: string, newStatus: RequestStatus) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.legalRequest.findUniqueOrThrow({ where: { id }, select: { status: true } });
      const updated = await tx.legalRequest.update({ where: { id }, data: { status: newStatus } });
      await tx.requestStatusHistory.create({
        data: {
          legalRequestId: id,
          userId,
          previousStatus: current.status,
          newStatus
        }
      });
      return updated;
    });
  },

  createNote(legalRequestId: string, userId: string, content: string) {
    return prisma.requestNote.create({
      data: { legalRequestId, userId, content },
      include: { user: { select: { id: true, name: true, email: true, role: true } } }
    });
  },

  listNotes(legalRequestId: string) {
    return prisma.requestNote.findMany({
      where: { legalRequestId },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" }
    });
  },

  listHistory(legalRequestId: string) {
    return prisma.requestStatusHistory.findMany({
      where: { legalRequestId },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" }
    });
  }
};
