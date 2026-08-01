import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { adminForgotPassword } from "@/api/auth";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const ForgotPassword = () => {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");

    setSubmitting(true);
    try {
      await adminForgotPassword(email);
    } finally {
      // Réponse volontairement identique en cas d'échec : on n'indique jamais
      // si un compte administrateur existe ou non pour cette adresse.
      setSubmitting(false);
      setSent(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="font-serif text-4xl leading-none text-foreground">MC</p>
          <p className="eyebrow-accent mt-3">Administration</p>
          <h1 className="mt-2 font-serif text-3xl text-foreground">Mot de passe oublié</h1>
        </div>

        {sent ? (
          <p className="mt-10 text-center text-sm leading-relaxed text-muted-foreground">
            Si un compte administrateur existe avec cette adresse, un e-mail
            contenant un lien de réinitialisation vient de vous être envoyé.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <div>
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Envoi…" : "Envoyer le lien"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/connexion" className="underline underline-offset-4 hover:text-foreground">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
