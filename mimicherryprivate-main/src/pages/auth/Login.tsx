import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthShell, AuthField, AuthSubmit } from "@/components/mc/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    setSubmitting(true);
    try {
      await login(email, password);
      const redirectTo = (location.state as { from?: string } | null)?.from ?? "/compte";
      navigate(redirectTo, { replace: true });
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
      title="Connexion"
      subtitle="Retrouvez vos commandes, vos adresses et vos pièces favorites."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link to="/creer-compte" className="link-underline text-foreground">
            Créer un compte
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <AuthField id="email" label="Adresse e-mail" type="email" autoComplete="email" placeholder="vous@exemple.com" />
        <AuthField id="password" label="Mot de passe" type="password" autoComplete="current-password" placeholder="••••••••" />
        <div className="flex justify-end">
          <Link
            to="/mot-de-passe-oublie"
            className="link-underline text-[0.66rem] uppercase tracking-[0.2em] text-muted-foreground"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <AuthSubmit disabled={submitting}>
          {submitting ? "Connexion…" : "Se connecter"}
        </AuthSubmit>
      </form>
    </AuthShell>
  );
};

export default Login;
