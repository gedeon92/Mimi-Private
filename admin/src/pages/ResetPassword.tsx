import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { adminResetPassword } from "@/api/auth";
import { ApiError } from "@/lib/api";
import { Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

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
      await adminResetPassword(token, password);
      toast("Mot de passe mis à jour", {
        description: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
      });
      navigate("/connexion", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="font-serif text-4xl leading-none text-foreground">MC</p>
          <p className="eyebrow-accent mt-3">Administration</p>
          <h1 className="mt-2 font-serif text-3xl text-foreground">Nouveau mot de passe</h1>
        </div>

        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <div>
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input id="password" name="password" type="password" autoComplete="new-password" required />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Mise à jour…" : "Réinitialiser le mot de passe"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/connexion" className="underline underline-offset-4 hover:text-foreground">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
