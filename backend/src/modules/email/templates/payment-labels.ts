/**
 * Libellé lisible d'une méthode de paiement à partir de la clé du prestataire
 * stockée en base (Payment.provider). Ajouter une entrée ici suffit à faire
 * apparaître correctement un nouveau moyen de paiement dans les e-mails et le
 * reçu PDF, sans toucher au reste du code — c'est le point d'extension prévu
 * pour Wave, Orange Money, carte bancaire, etc.
 */
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  manual: "À convenir à la livraison",
  wave: "Wave",
  orange_money: "Orange Money",
  card: "Carte bancaire",
};

export function getPaymentMethodLabel(provider: string): string {
  return PAYMENT_METHOD_LABELS[provider] ?? provider;
}
