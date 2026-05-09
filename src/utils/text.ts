export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeApostrophes(value: string): string {
  return value.replace(/[’']/g, "'");
}

export function buildFlexibleTextPattern(value: string): RegExp {
  const normalized = escapeRegex(normalizeApostrophes(value));
  return new RegExp(normalized.replace(/'/g, "[’']"), "i");
}

export function toSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}
