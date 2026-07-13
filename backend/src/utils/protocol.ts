export function buildProtocol(year: number, sequence: number) {
  return `AJ-${year}-${String(sequence).padStart(6, "0")}`;
}

export function extractProtocolSequence(protocol?: string | null) {
  if (!protocol) return 0;
  const parts = protocol.split("-");
  return Number(parts[2] ?? 0) || 0;
}

