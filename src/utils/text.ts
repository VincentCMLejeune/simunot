export const normalizeText = (text: string): string => {
  const normalized = text.toLowerCase().replace(/_/g, ' ');
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}