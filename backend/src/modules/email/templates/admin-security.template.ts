import { renderEmailLayout } from "./layout";
import { renderParagraph } from "./components";
import { escapeHtml } from "./html-utils";
import { BRAND_COLORS } from "./colors";

/** Équivalent de accountSecurityEmail, dédié à l'espace administrateur (message plus ferme). */
export function renderAdminSecurityEmail(opts: { firstName: string; actionMessage: string }) {
  const bodyHtml =
    renderParagraph(`Bonjour ${escapeHtml(opts.firstName)},`) +
    renderParagraph(opts.actionMessage) +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_COLORS.burgundy}; border-radius: 18px; margin: 8px 0 24px;">
      <tr>
        <td style="padding: 20px 24px; font-family: Arial, sans-serif; font-size: 13px; line-height:1.6; color:${BRAND_COLORS.white};">
          <strong>Vous n'êtes pas à l'origine de cette modification ?</strong><br/>
          Veuillez vérifier immédiatement votre compte et contacter
          <a href="mailto:contact@mimicherryprivate.com" style="color:${BRAND_COLORS.white}; text-decoration:underline;">contact@mimicherryprivate.com</a>.
        </td>
      </tr>
    </table>`;

  return {
    subject: "Sécurité — espace administrateur",
    html: renderEmailLayout({
      previewText: opts.actionMessage,
      eyebrow: "Espace administrateur",
      title: "Modification de votre compte administrateur confirmée.",
      bodyHtml,
    }),
  };
}
