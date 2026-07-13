import { RequestStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export const dashboardService = {
  async metrics() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [total, byStatus, byArea, byState, recent] = await Promise.all([
      prisma.legalRequest.count(),
      prisma.legalRequest.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.legalRequest.groupBy({ by: ["legalArea"], _count: { _all: true } }),
      prisma.legalRequest.groupBy({ by: ["state"], _count: { _all: true } }),
      prisma.legalRequest.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" }
      })
    ]);

    const statusCount = Object.fromEntries(byStatus.map((item) => [item.status, item._count._all]));
    return {
      total,
      new: statusCount[RequestStatus.NEW] ?? 0,
      underReview: statusCount[RequestStatus.UNDER_REVIEW] ?? 0,
      inProgress: statusCount[RequestStatus.IN_PROGRESS] ?? 0,
      completed: statusCount[RequestStatus.COMPLETED] ?? 0,
      byArea: byArea.map((item) => ({ legalArea: item.legalArea, total: item._count._all })),
      byState: byState.map((item) => ({ state: item.state, total: item._count._all })),
      last30Days: recent.reduce<Record<string, number>>((acc, item) => {
        const key = item.createdAt.toISOString().slice(0, 10);
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {})
    };
  }
};

