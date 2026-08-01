import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { updateAdminProfile, changeAdminPassword } from "@/api/users";
import { ApiError } from "@/lib/api";

const Profile = () => {
  const { admin, setAdmin } = useAdminAuth();
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  if (!admin) return null;

  const onProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError(null);
    const form = new FormData(e.currentTarget);
    setProfileSubmitting(true);
    try {
      const updated = await updateAdminProfile({
        firstName: String(form.get("firstName") ?? ""),
        lastName: String(form.get("lastName") ?? ""),
        phone: String(form.get("phone") ?? "") || undefined,
      });
      setAdmin(updated);
      toast("Profil mis à jour");
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    } finally {
      setProfileSubmitting(false);
    }
  };

  const onPasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);
    const form = new FormData(e.currentTarget);
    const currentPassword = String(form.get("currentPassword") ?? "");
    const newPassword = String(form.get("newPassword") ?? "");

    setPasswordSubmitting(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      toast("Mot de passe mis à jour");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setPasswordError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <p className="eyebrow-accent mb-2">Compte</p>
      <h1 className="font-serif text-4xl text-foreground">Mon profil</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-offwhite/50 p-7">
          <h2 className="font-serif text-xl text-foreground">Informations</h2>
          <form onSubmit={onProfileSubmit} className="mt-5 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" name="firstName" required defaultValue={admin.firstName} />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" name="lastName" required defaultValue={admin.lastName} />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={admin.phone ?? ""} />
            </div>
            <p className="text-xs text-muted-foreground">E-mail : {admin.email}</p>
            {profileError && <p className="text-sm text-destructive">{profileError}</p>}
            <Button type="submit" disabled={profileSubmitting}>
              {profileSubmitting ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </form>
        </div>

        <div className="rounded-3xl border border-border bg-offwhite/50 p-7">
          <h2 className="font-serif text-xl text-foreground">Changer le mot de passe</h2>
          <form onSubmit={onPasswordSubmit} className="mt-5 space-y-5">
            <div>
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" />
            </div>
            <div>
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input id="newPassword" name="newPassword" type="password" required autoComplete="new-password" minLength={8} />
            </div>
            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            <Button type="submit" disabled={passwordSubmitting}>
              {passwordSubmitting ? "Mise à jour…" : "Changer le mot de passe"}
            </Button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;
