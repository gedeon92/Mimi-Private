import { Injectable } from "@nestjs/common";
import type { CreatePaymentInput, CreatePaymentResult, PaymentProvider } from "../payment-provider.interface";

/**
 * Comportement actuel : la commande est enregistrée en attente de règlement,
 * finalisé directement entre l'administrateur et le client (téléphone,
 * livraison). Sert de prestataire par défaut tant qu'aucun moyen de paiement
 * en ligne n'est branché.
 */
@Injectable()
export class ManualPaymentProvider implements PaymentProvider {
  readonly name = "manual";

  async createPayment(_input: CreatePaymentInput): Promise<CreatePaymentResult> {
    return { status: "PENDING" };
  }
}
