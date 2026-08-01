import { renderEmailLayout } from "./layout";
import { renderParagraph } from "./components";
import { escapeHtml } from "./html-utils";

/** Purement informatif — aucun bouton, aucune incitation marketing. */
export function renderWelcomeEmail(opts: { firstName: string }) {
  const bodyHtml =
    renderParagraph(`Bonjour ${escapeHtml(opts.firstName)},`) +
    renderParagraph(
      "Bienvenue dans notre communauté. Nous sommes heureux de vous compter parmi nos clients.",
    ) +
    renderParagraph(
      "Votre compte Mimi Cherry Private vient d'être créé avec succès. Vous pouvez désormais suivre vos commandes, enregistrer vos adresses de livraison et retrouver votre historique d'achats depuis votre espace client.",
    ) +
    renderParagraph(
      "Pour toute question, notre équipe se tient à votre disposition à l'adresse contact@mimicherryprivate.com.",
    );

  return {
    subject: "Bienvenue chez Mimi Cherry Private",
    html: renderEmailLayout({
      previewText: "Votre compte a été créé — bienvenue dans notre communauté.",
      eyebrow: "Bienvenue",
      title: "Votre compte a été créé avec succès.",
      bodyHtml,
    }),
  };
}
