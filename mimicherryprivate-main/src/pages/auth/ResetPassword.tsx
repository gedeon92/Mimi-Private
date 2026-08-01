import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { AuthShell, AuthField, AuthSubmit } from "@/components/mc/AuthShell";
import { resetPassword } from "@/api/auth";
import { ApiError } from "@/lib/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (!token) {
      setError("Ce lien de réinitialisation est invalide.");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, password);
      toast("Mot de passe mis à jour", {
        description: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
      });
      navigate("/connexion", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Une erreur est survenue. Réessayez.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Espace client"
      title="Nouveau mot de passe"
      subtitle="Choisissez un nouveau mot de passe pour votre compte."
      footer={
        <Link to="/connexion" className="link-underline text-foreground">
          Retour à la connexion
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <AuthField
          id="password"
          name="password"
          label="Nouveau mot de passe"
          type="password"
          autoComplete="new-password"
          placeholder="8 caractères minimum"
        />
        <AuthField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirmer le mot de passe"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
        />
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <AuthSubmit disabled={submitting}>
          {submitting ? "Mise à jour…" : "Réinitialiser le mot de passe"}
        </AuthSubmit>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
