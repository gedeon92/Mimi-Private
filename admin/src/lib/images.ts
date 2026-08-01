const API_ORIGIN = (import.meta.env.VITE_API_URL ?? "http://localhost:4000/api").replace(/\/api\/?$/, "");

// Placeholder neutre pour les anciennes images seedées (simples clés type "std-fauve",
// héritées de la période où le catalogue vivait dans le bundle du front client — elles
// n'ont pas d'URL réelle tant qu'elles n'ont pas été ré-uploadées depuis l'admin).
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='250'%3E%3Crect width='200' height='250' fill='%23ece7df'/%3E%3C/svg%3E";

export function resolveImage(value: string | undefined | null): string {
  if (!value) return PLACEHOLDER;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/")) return `${API_ORIGIN}${value}`;
  return PLACEHOLDER;
}
