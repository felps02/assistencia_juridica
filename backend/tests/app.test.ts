import bcrypt from "bcrypt";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
  },
  legalRequest: {
    count: vi.fn(),
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    findUniqueOrThrow: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    groupBy: vi.fn()
  },
  requestNote: {
    create: vi.fn(),
    findMany: vi.fn()
  },
  requestStatusHistory: {
    create: vi.fn(),
    findMany: vi.fn()
  },
  $queryRaw: vi.fn(),
  $transaction: vi.fn(),
  $disconnect: vi.fn()
}));

vi.mock("../src/config/prisma.js", () => ({ prisma: prismaMock }));
vi.mock("../src/storage/index.js", () => ({
  makeStorageProvider: () => ({
    save: vi.fn(async (file: Express.Multer.File) => ({
      originalName: file.originalname,
      storedName: file.originalname,
      fileUrl: `/uploads/${file.originalname}`,
      mimeType: file.mimetype,
      fileSize: file.size
    }))
  })
}));
vi.mock("../src/services/mail.service.js", () => ({ mailService: { sendLegalRequestEmails: vi.fn(async () => undefined) } }));

const { app } = await import("../src/app.js");

async function adminToken() {
  const passwordHash = await bcrypt.hash("senha-segura", 4);
  prismaMock.user.findUnique.mockResolvedValueOnce({
    id: "user-1",
    name: "Admin",
    email: "admin@test.com",
    passwordHash,
    role: "ADMIN",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const response = await request(app).post("/api/auth/login").send({ email: "admin@test.com", password: "senha-segura" });
  return response.body.data.token as string;
}

beforeEach(() => {
  vi.clearAllMocks();
  prismaMock.$queryRaw.mockResolvedValue([{ "1": 1 }]);
});

describe("API", () => {
  it("retorna health check com banco conectado", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.database).toBe("connected");
  });

  it("faz login com credenciais válidas", async () => {
    const passwordHash = await bcrypt.hash("senha-segura", 4);
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: "1", name: "Admin", email: "admin@test.com", passwordHash, role: "ADMIN", active: true });
    const response = await request(app).post("/api/auth/login").send({ email: "admin@test.com", password: "senha-segura" });
    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeTruthy();
  });

  it("rejeita login inválido", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);
    const response = await request(app).post("/api/auth/login").send({ email: "admin@test.com", password: "errada" });
    expect(response.status).toBe(401);
  });

  it("cria solicitação válida", async () => {
    prismaMock.legalRequest.findFirst.mockResolvedValueOnce(null);
    prismaMock.legalRequest.create.mockResolvedValueOnce({ id: "req-1", protocol: "AJ-2026-000001", fullName: "Maria Silva", email: "maria@test.com", legalArea: "CIVIL", createdAt: new Date() });
    const response = await request(app)
      .post("/api/legal-requests")
      .field("fullName", "Maria Silva")
      .field("email", "maria@test.com")
      .field("phone", "11999999999")
      .field("city", "São Paulo")
      .field("state", "SP")
      .field("customerType", "PERSON")
      .field("legalArea", "CIVIL")
      .field("contactPreference", "EMAIL")
      .field("caseDescription", "Descrição suficientemente detalhada para validação.")
      .field("consentAccepted", "true");
    expect(response.status).toBe(201);
    expect(response.body.data.protocol).toBe("AJ-2026-000001");
  });

  it("retorna erro de validação", async () => {
    const response = await request(app).post("/api/legal-requests").send({ email: "invalido" });
    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });

  it("bloqueia rota protegida sem token", async () => {
    const response = await request(app).get("/api/legal-requests");
    expect(response.status).toBe(401);
  });

  it("altera status de uma solicitação", async () => {
    const token = await adminToken();
    prismaMock.$transaction.mockImplementationOnce(async (callback) => callback({
      legalRequest: {
        findUniqueOrThrow: vi.fn().mockResolvedValue({ status: "NEW" }),
        update: vi.fn().mockResolvedValue({ id: "req-1", status: "UNDER_REVIEW" })
      },
      requestStatusHistory: { create: vi.fn().mockResolvedValue({}) }
    }));
    const response = await request(app).patch("/api/legal-requests/req-1/status").set("Authorization", `Bearer ${token}`).send({ status: "UNDER_REVIEW" });
    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("UNDER_REVIEW");
  });

  it("lista solicitações paginadas", async () => {
    const token = await adminToken();
    prismaMock.legalRequest.count.mockResolvedValueOnce(1);
    prismaMock.legalRequest.findMany.mockResolvedValueOnce([{ id: "req-1", protocol: "AJ-2026-000001" }]);
    prismaMock.$transaction.mockImplementationOnce(async (operations) => Promise.all(operations));
    const response = await request(app).get("/api/legal-requests?page=1&perPage=10").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data.meta.total).toBe(1);
  });
});

