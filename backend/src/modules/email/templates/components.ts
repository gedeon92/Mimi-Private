import { BRAND_COLORS } from "./colors";
import { escapeHtml } from "./html-utils";

/** Bouton d'action principal — motif "bulletproof" (table + padding) pour une compatibilité email large. */
export function renderButton(label: string, url: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 28px 0;">
      <tr>
        <td align="center" style="background-color:${BRAND_COLORS.ink}; border-radius: 999px;">
          <a href="${url}" target="_blank"
             style="display:inline-block; padding: 15px 36px; font-family: Arial, sans-serif; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color:${BRAND_COLORS.white}; text-decoration:none;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

/** Paragraphe de texte standard du corps de l'e-mail. */
export function renderParagraph(text: string): string {
  return `<p style="margin:0 0 18px; font-family: Georgia, 'Times New Roman', serif; font-size: 15px; line-height: 1.7; color:${BRAND_COLORS.ink};">${text}</p>`;
}

/** Carte d'information (fond ivoire, coins arrondis) contenant une liste libellé/valeur. */
export function renderInfoCard(rows: { label: string; value: string }[]): string {
  const rowsHtml = rows
    .map(
      (r) => `
      <tr>
        <td style="padding: 6px 0; font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color:${BRAND_COLORS.muted}; width: 40%; vertical-align: top;">${escapeHtml(r.label)}</td>
        <td style="padding: 6px 0; font-family: Arial, sans-serif; font-size: 14px; color:${BRAND_COLORS.ink}; vertical-align: top;">${r.value}</td>
      </tr>`,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="background-color:${BRAND_COLORS.offwhite}; border-radius: 18px; margin: 8px 0 24px;">
      <tr>
        <td style="padding: 22px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}</table>
        </td>
      </tr>
    </table>`;
}

export interface EmailOrderLine {
  productName: string;
  colorName: string;
  quantity: number;
  unitPrice: number;
  formattedUnitPrice: string;
  formattedLineTotal: string;
}

/** Tableau récapitulatif des articles d'une commande. */
export function renderOrderItemsTable(items: EmailOrderLine[]): string {
  const rows = items
    .map(
      (item, i) => `
      <tr>
        <td style="padding: 14px 0; border-top: ${i === 0 ? "none" : `1px solid ${BRAND_COLORS.border}`}; font-family: Georgia, serif; font-size: 14px; color:${BRAND_COLORS.ink};">
          ${escapeHtml(item.productName)}<br/>
          <span style="font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.5px; color:${BRAND_COLORS.muted};">Teinte ${escapeHtml(item.colorName)} · Qté ${item.quantity}</span>
        </td>
        <td align="right" style="padding: 14px 0; border-top: ${i === 0 ? "none" : `1px solid ${BRAND_COLORS.border}`}; font-family: Arial, sans-serif; font-size: 14px; font-weight:bold; color:${BRAND_COLORS.ink}; white-space:nowrap;">
          ${item.formattedLineTotal} FCFA
        </td>
      </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 8px 0 8px;">${rows}</table>`;
}

/** Ligne de total (sous-total, livraison, total général…). */
export function renderTotalRow(label: string, value: string, emphasis = false): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: ${emphasis ? "12px" : "2px"} 0;">
      <tr>
        <td style="font-family: Arial, sans-serif; font-size: ${emphasis ? "13px" : "12px"}; letter-spacing: 1px; text-transform: uppercase; color:${emphasis ? BRAND_COLORS.ink : BRAND_COLORS.muted};">${escapeHtml(label)}</td>
        <td align="right" style="font-family: Georgia, serif; font-size: ${emphasis ? "20px" : "13px"}; color:${BRAND_COLORS.ink}; font-weight: ${emphasis ? "bold" : "normal"};">${value}</td>
      </tr>
    </table>`;
}
