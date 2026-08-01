import { Injectable } from "@nestjs/common";
import type { CreatePaymentInput, CreatePaymentResult, PaymentProvider } from "./payment-provider.interface";
import { ManualPaymentProvider } from "./providers/manual.provider";

/**
 * Point d'entrée unique pour créer un paiement, quel que soit le prestataire
 * actif. Aujourd'hui figé sur `ManualPaymentProvider` ; demain, sélectionnable
 * via une variable d'environnement (ex. PAYMENT_PROVIDER=wave) une fois un
 * vrai prestataire implémenté — aucun appelant (OrdersService) n'aura à changer.
 */
@Injectable()
export class PaymentsService {
  private readonly provider: PaymentProvider;

  constructor(manualProvider: ManualPaymentProvider) {
    this.provider = manualProvider;
  }

  get providerName(): string {
    return this.provider.name;
  }

  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    return this.provider.createPayment(input);
  }
}
