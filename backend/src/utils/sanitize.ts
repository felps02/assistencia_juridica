export function sanitizeString(value: string) {
  return value.replace(/[<>]/g, "").trim();
}

export function stripSensitiveUser<T extends { passwordHash?: string }>(user: T) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

