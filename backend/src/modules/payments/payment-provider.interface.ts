export interface CreatePaymentInput {
  amount: number;
  customerEmail: string;
  customerName: string;
}

export interface CreatePaymentResult {
  status: "PENDING" | "PAID" | "FAILED";
  /** Référence du prestataire (id de transaction/session), si disponible. */
  providerRef?: string;
  /** URL de redirection vers la page de paiement du prestataire, si applicable. */
  redirectUrl?: string;
}

/**
 * Contrat que devra implémenter tout futur prestataire de paiement
 * (Wave, Orange Money, carte bancaire…). Ajouter un prestataire = créer une
 * classe qui implémente cette interface et la brancher dans PaymentsService —
 * aucune autre partie de l'application n'a besoin de changer.
 */
export interface PaymentProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
}
