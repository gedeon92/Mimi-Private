import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthShell, AuthField, AuthSubmit } from "@/components/mc/AuthShell";
import { forgotPassword } from "@/api/auth";

const ForgotPassword = () => {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");

    setSubmitting(true);
    try {
      await forgotPassword(email);
    } finally {
      // Réponse volontairement identique en cas d'échec : on n'indique jamais
      // si une adresse existe ou non (protection contre l'énumération de comptes).
      setSubmitting(false);
      setSent(true);
    }
  };

  return (
    <AuthShell
      eyebrow="Espace client"
      title="Mot de passe oublié"
      subtitle="Indiquez votre adresse e-mail : nous vous enverrons un lien de réinitialisation."
      footer={
        <Link to="/connexion" className="link-underline text-foreground">
          Retour à la connexion
        </Link>
      }
    >
      {sent ? (
        <p className="text-center text-sm leading-relaxed text-muted-foreground">
          Si un compte existe avec cette adresse, un e-mail contenant un lien de
          réinitialisation vient de vous être envoyé.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <AuthField id="email" label="Adresse e-mail" type="email" autoComplete="email" placeholder="vous@exemple.com" />
          <AuthSubmit disabled={submitting}>
            {submitting ? "Envoi…" : "Envoyer le lien"}
          </AuthSubmit>
        </form>
      )}
    </AuthShell>
  );
};

export default ForgotPassword;
