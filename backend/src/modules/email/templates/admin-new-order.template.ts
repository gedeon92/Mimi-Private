import { renderEmailLayout } from "./layout";
import { renderInfoCard, renderOrderItemsTable, renderParagraph, renderTotalRow, type EmailOrderLine } from "./components";
import { escapeHtml } from "./html-utils";
import { BRAND_COLORS } from "./colors";

export interface AdminNewOrderEmailOptions {
  orderRef: string;
  orderDate: string;
  orderTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  items: EmailOrderLine[];
  totalFormatted: string;
  paymentMethodLabel: string;
}

export function renderAdminNewOrderEmail(opts: AdminNewOrderEmailOptions) {
  const bodyHtml =
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_COLORS.burgundy}; border-radius: 14px; margin: 0 0 24px;">
      <tr>
        <td style="padding: 18px 22px; font-family: Arial, sans-serif; font-size: 13px; line-height:1.6; color:${BRAND_COLORS.white};">
          Une nouvelle commande a été enregistrée.<br/>
          Veuillez contacter le client afin d'organiser la livraison.
        </td>
      </tr>
    </table>` +
    renderInfoCard([
      { label: "N° de commande", value: `<strong>${escapeHtml(opts.orderRef)}</strong>` },
      { label: "Date", value: `${escapeHtml(opts.orderDate)} à ${escapeHtml(opts.orderTime)}` },
      { label: "Client", value: escapeHtml(opts.customerName) },
      {
        label: "E-mail",
        value: `<a href="mailto:${escapeHtml(opts.customerEmail)}" style="color:${BRAND_COLORS.burgundy};">${escapeHtml(opts.customerEmail)}</a>`,
      },
      { label: "Téléphone", value: opts.customerPhone ? escapeHtml(opts.customerPhone) : "Non renseigné" },
      { label: "Paiement", value: escapeHtml(opts.paymentMethodLabel) },
    ]) +
    `<h2 style="margin:0 0 8px; font-family: Georgia, 'Times New Roman', serif; font-size: 18px; color:${BRAND_COLORS.ink};">Articles commandés</h2>` +
    renderOrderItemsTable(opts.items) +
    `<div style="height:1px; background-color:${BRAND_COLORS.border}; margin: 12px 0;"></div>` +
    renderTotalRow("Montant total", `${opts.totalFormatted} FCFA`, true) +
    renderParagraph("Connectez-vous au dashboard administrateur pour consulter le détail complet de cette commande.");

  return {
    subject: `Nouvelle commande ${opts.orderRef} — ${opts.customerName}`,
    html: renderEmailLayout({
      previewText: `Nouvelle commande de ${opts.customerName} — ${opts.totalFormatted} FCFA.`,
      eyebrow: "Nouvelle commande",
      title: "Une nouvelle commande vient d'arriver.",
      bodyHtml,
    }),
  };
}
