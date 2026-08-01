import { renderEmailLayout } from "./layout";
import {
  renderInfoCard,
  renderOrderItemsTable,
  renderParagraph,
  renderTotalRow,
  type EmailOrderLine,
} from "./components";
import { escapeHtml } from "./html-utils";

export interface OrderConfirmationEmailOptions {
  firstName: string;
  orderRef: string;
  orderDate: string;
  orderTime: string;
  items: EmailOrderLine[];
  subtotalFormatted: string;
  shippingCostFormatted: string;
  totalFormatted: string;
  shippingFirstName: string;
  shippingLastName: string;
  shippingLine1: string;
  shippingLine2?: string | null;
  shippingCity: string;
  shippingCountry: string;
  shippingPhone: string;
  paymentMethodLabel: string;
  hasReceiptAttachment: boolean;
}

export function renderOrderConfirmationEmail(opts: OrderConfirmationEmailOptions) {
  const addressLines = [
    `${escapeHtml(opts.shippingFirstName)} ${escapeHtml(opts.shippingLastName)}`,
    escapeHtml(opts.shippingLine1),
    opts.shippingLine2 ? escapeHtml(opts.shippingLine2) : null,
    `${escapeHtml(opts.shippingCity)}, ${escapeHtml(opts.shippingCountry)}`,
    escapeHtml(opts.shippingPhone),
  ]
    .filter(Boolean)
    .join("<br/>");

  const bodyHtml =
    renderParagraph(`Bonjour ${escapeHtml(opts.firstName)},`) +
    renderParagraph(
      "Votre commande vient d'être enregistrée avec succès. Voici le récapitulatif complet de votre acquisition.",
    ) +
    renderInfoCard([
      { label: "N° de commande", value: `<strong>${escapeHtml(opts.orderRef)}</strong>` },
      { label: "Date", value: `${escapeHtml(opts.orderDate)} à ${escapeHtml(opts.orderTime)}` },
      { label: "Paiement", value: escapeHtml(opts.paymentMethodLabel) },
    ]) +
    `<h2 style="margin:0 0 8px; font-family: Georgia, 'Times New Roman', serif; font-size: 18px; color:#161310;">Votre sélection</h2>` +
    renderOrderItemsTable(opts.items) +
    `<div style="height:1px; background-color:#E2DDD3; margin: 16px 0;"></div>` +
    renderTotalRow("Sous-total", `${opts.subtotalFormatted} FCFA`) +
    renderTotalRow("Livraison", opts.shippingCostFormatted) +
    `<div style="height:1px; background-color:#E2DDD3; margin: 12px 0;"></div>` +
    renderTotalRow("Total", `${opts.totalFormatted} FCFA`, true) +
    `<h2 style="margin:32px 0 8px; font-family: Georgia, 'Times New Roman', serif; font-size: 18px; color:#161310;">Livraison</h2>` +
    renderInfoCard([{ label: "Adresse", value: addressLines }]) +
    (opts.hasReceiptAttachment
      ? renderParagraph("Vous trouverez votre reçu détaillé en pièce jointe de cet e-mail, au format PDF.")
      : "") +
    renderParagraph(
      "Notre équipe vous contactera très prochainement par téléphone afin d'organiser la livraison et finaliser le règlement.",
    );

  return {
    subject: `Confirmation de votre commande ${opts.orderRef}`,
    html: renderEmailLayout({
      previewText: `Votre commande ${opts.orderRef} est enregistrée — total ${opts.totalFormatted} FCFA.`,
      eyebrow: "Commande confirmée",
      title: "Merci pour votre commande.",
      bodyHtml,
    }),
  };
}
