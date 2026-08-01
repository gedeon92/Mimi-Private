import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell, AuthField, AuthSubmit } from "@/components/mc/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    setSubmitting(true);
    try {
      await register(payload);
      navigate("/compte", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Une erreur est survenue. Réessayez.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Espace client"
      title="Créer un compte"
      subtitle="Rejoignez la maison pour suivre vos commandes et composer votre sélection."
      footer={
        <>
          Vous avez déjà un compte ?{" "}
          <Link to="/connexion" className="link-underline text-foreground">
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField id="firstName" label="Prénom" autoComplete="given-name" placeholder="Prénom" />
          <AuthField id="lastName" label="Nom" autoComplete="family-name" placeholder="Nom" />
        </div>
        <AuthField id="email" label="Adresse e-mail" type="email" autoComplete="email" placeholder="vous@exemple.com" />
        <AuthField
          id="password"
          label="Mot de passe"
          type="password"
          autoComplete="new-password"
          placeholder="8 caractères minimum"
        />
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <AuthSubmit disabled={submitting}>
          {submitting ? "Création…" : "Créer mon compte"}
        </AuthSubmit>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          En créant un compte, vous acceptez nos conditions et notre politique de
          confidentialité.
        </p>
      </form>
    </AuthShell>
  );
};

export default Register;
