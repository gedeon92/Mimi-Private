import { renderEmailLayout } from "./layout";
import { renderParagraph } from "./components";
import { escapeHtml } from "./html-utils";
import { BRAND_COLORS } from "./colors";

/**
 * Un seul template pour toute modification sensible du compte CLIENT
 * (e-mail ou mot de passe) — seul le message d'action change. Purement
 * informatif : aucun bouton, aucune incitation marketing.
 */
export function renderAccountSecurityEmail(opts: { firstName: string; actionMessage: string }) {
  const bodyHtml =
    renderParagraph(`Bonjour ${escapeHtml(opts.firstName)},`) +
    renderParagraph(opts.actionMessage) +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_COLORS.offwhite}; border-radius: 18px; margin: 8px 0 24px;">
      <tr>
        <td style="padding: 20px 24px; font-family: Arial, sans-serif; font-size: 13px; line-height:1.6; color:${BRAND_COLORS.ink};">
          <strong>Vous n'êtes pas à l'origine de cette modification ?</strong><br/>
          Contactez immédiatement notre support à
          <a href="mailto:contact@mimicherryprivate.com" style="color:${BRAND_COLORS.burgundy};">contact@mimicherryprivate.com</a>.
        </td>
      </tr>
    </table>`;

  return {
    subject: "Sécurité de votre compte — modification confirmée",
    html: renderEmailLayout({
      previewText: opts.actionMessage,
      eyebrow: "Sécurité du compte",
      title: "Modification de votre compte confirmée.",
      bodyHtml,
    }),
  };
}
