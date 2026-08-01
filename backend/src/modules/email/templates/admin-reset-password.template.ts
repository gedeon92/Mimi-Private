import { renderEmailLayout } from "./layout";
import { renderButton, renderParagraph } from "./components";
import { BRAND_COLORS } from "./colors";

/** Équivalent de resetPasswordEmail, dédié à l'espace administrateur. */
export function renderAdminResetPasswordEmail(opts: { resetUrl: string; expiresInMinutes: number }) {
  const bodyHtml =
    renderParagraph(
      "Une demande de réinitialisation du mot de passe de votre compte administrateur a été effectuée.",
    ) +
    renderButton("Réinitialiser mon mot de passe", opts.resetUrl) +
    `<p style="margin:0 0 18px; font-family: Arial, sans-serif; font-size: 12px; line-height:1.6; color:${BRAND_COLORS.muted};">
      Ce lien est valable ${opts.expiresInMinutes} minutes et ne peut être utilisé qu'une seule fois.
    </p>` +
    renderParagraph(
      "Si vous n'êtes pas à l'origine de cette demande, aucune action n'est requise : votre mot de passe restera inchangé.",
    );

  return {
    subject: "Réinitialisation de votre mot de passe administrateur",
    html: renderEmailLayout({
      previewText: "Un lien pour réinitialiser votre mot de passe administrateur, valable 30 minutes.",
      eyebrow: "Espace administrateur",
      title: "Réinitialiser votre mot de passe administrateur.",
      bodyHtml,
    }),
  };
}
