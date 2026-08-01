import { renderEmailLayout } from "./layout";
import { renderButton, renderParagraph } from "./components";
import { BRAND_COLORS } from "./colors";

export function renderResetPasswordEmail(opts: { resetUrl: string; expiresInMinutes: number }) {
  const bodyHtml =
    renderParagraph(
      "Vous avez demandé la réinitialisation du mot de passe de votre compte Mimi Cherry Private.",
    ) +
    renderButton("Réinitialiser mon mot de passe", opts.resetUrl) +
    `<p style="margin:0 0 18px; font-family: Arial, sans-serif; font-size: 12px; line-height:1.6; color:${BRAND_COLORS.muted};">
      Ce lien est valable ${opts.expiresInMinutes} minutes et ne peut être utilisé qu'une seule fois.
    </p>` +
    renderParagraph(
      "Si vous n'êtes pas à l'origine de cette demande, aucune action n'est requise : votre mot de passe restera inchangé.",
    );

  return {
    subject: "Réinitialisation de votre mot de passe",
    html: renderEmailLayout({
      previewText: "Un lien pour réinitialiser votre mot de passe, valable 30 minutes.",
      eyebrow: "Sécurité du compte",
      title: "Réinitialiser votre mot de passe.",
      bodyHtml,
    }),
  };
}
