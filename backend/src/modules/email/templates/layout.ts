import { BRAND_COLORS } from "./colors";
import { escapeHtml } from "./html-utils";

export interface EmailLayoutOptions {
  /** Texte d'aperçu caché (ce que Gmail/Outlook affichent avant l'ouverture). */
  previewText: string;
  eyebrow?: string;
  title: string;
  /** Corps HTML déjà construit (paragraphes, cartes, boutons…). */
  bodyHtml: string;
}

/**
 * Enveloppe commune à tous les e-mails transactionnels : en-tête de marque
 * (wordmark textuel — une image hébergée en local ne s'afficherait pas chez
 * un vrai destinataire), corps, pied de page. Mise en page en tableaux et
 * styles en ligne pour une compatibilité maximale (Outlook, Gmail, Apple Mail).
 */
export function renderEmailLayout(opts: EmailLayoutOptions): string {
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="light" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<title>${escapeHtml(opts.title)}</title>
<style>
  @media only screen and (max-width: 600px) {
    .mc-container { width: 100% !important; }
    .mc-px { padding-left: 24px !important; padding-right: 24px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:${BRAND_COLORS.offwhite};">
<div style="display:none; max-height:0; overflow:hidden; opacity:0; mso-hide:all;">${escapeHtml(opts.previewText)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_COLORS.offwhite};">
  <tr>
    <td align="center" style="padding: 32px 12px;">
      <table role="presentation" class="mc-container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:${BRAND_COLORS.white};">
        <tr>
          <td align="center" style="background-color:${BRAND_COLORS.ink}; padding: 36px 24px;">
            <p style="margin:0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; letter-spacing: 6px; color:${BRAND_COLORS.white};">MIMI CHERRY</p>
            <p style="margin:6px 0 0; font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 4px; color:${BRAND_COLORS.gold}; text-transform: uppercase;">Private</p>
          </td>
        </tr>
        <tr>
          <td class="mc-px" style="padding: 40px 48px;">
            ${
              opts.eyebrow
                ? `<p style="margin:0 0 12px; font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 3px; text-transform:uppercase; color:${BRAND_COLORS.burgundy};">${escapeHtml(opts.eyebrow)}</p>`
                : ""
            }
            <h1 style="margin:0 0 24px; font-family: Georgia, 'Times New Roman', serif; font-size: 27px; line-height:1.3; color:${BRAND_COLORS.ink}; font-weight:normal;">${escapeHtml(opts.title)}</h1>
            ${opts.bodyHtml}
          </td>
        </tr>
        <tr>
          <td align="center" style="background-color:${BRAND_COLORS.offwhite}; padding: 28px 24px; border-top: 1px solid ${BRAND_COLORS.border};">
            <p style="margin:0; font-family: Arial, sans-serif; font-size:11px; letter-spacing:1px; color:${BRAND_COLORS.muted};">Mimi Cherry Private — Maroquinerie sculpturale née à Dakar</p>
            <p style="margin:10px 0 0; font-family: Arial, sans-serif; font-size:11px;">
              <a href="mailto:contact@mimicherryprivate.com" style="color:${BRAND_COLORS.muted}; text-decoration:underline;">contact@mimicherryprivate.com</a>
            </p>
            <p style="margin:14px 0 0; font-family: Arial, sans-serif; font-size:10px; color:${BRAND_COLORS.muted};">© ${year} Mimi Cherry Private. Tous droits réservés.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
