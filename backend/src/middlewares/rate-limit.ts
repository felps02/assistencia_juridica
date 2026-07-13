import rateLimit from "express-rate-limit";

export const publicFormRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Muitas solicitações. Tente novamente em alguns minutos." }
});

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Muitas tentativas de login. Tente novamente em alguns minutos." }
});

