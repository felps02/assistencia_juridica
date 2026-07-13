export const customerTypeOptions = [
  { value: "PERSON", label: "Pessoa física" },
  { value: "COMPANY", label: "Pessoa jurídica" }
];

export const legalAreaOptions = [
  { value: "LABOR", label: "Trabalhista" },
  { value: "CIVIL", label: "Civil" },
  { value: "FAMILY", label: "Família" },
  { value: "SOCIAL_SECURITY", label: "Previdenciário" },
  { value: "CONSUMER", label: "Consumidor" },
  { value: "BUSINESS", label: "Empresarial" },
  { value: "REAL_ESTATE", label: "Imobiliário" },
  { value: "OTHER", label: "Outro" }
];

export const contactPreferenceOptions = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "PHONE", label: "Telefone" },
  { value: "EMAIL", label: "E-mail" },
  { value: "VIDEO_CALL", label: "Videoconferência" }
];

export const statusOptions = [
  { value: "NEW", label: "Nova" },
  { value: "UNDER_REVIEW", label: "Em análise" },
  { value: "WAITING_CLIENT", label: "Aguardando cliente" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "COMPLETED", label: "Concluída" },
  { value: "CANCELLED", label: "Cancelada" }
];

export function labelFor(options: { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

