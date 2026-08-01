import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Package, MapPin, Heart, ShoppingBag, ArrowUpRight, Pencil } from "lucide-react";
import { toast } from "sonner";
import { AccountLayout } from "@/components/mc/AccountLayout";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";
import { changeEmail, changePassword } from "@/api/users";

const tiles = [
  { icon: Package, title: "Mes commandes", body: "Suivez vos commandes et retrouvez votre historique.", to: "/compte/commandes" },
  { icon: MapPin, title: "Mes adresses", body: "Gérez vos adresses de livraison et de facturation.", to: "/compte/adresses" },
  { icon: Heart, title: "Mes favoris", body: "Retrouvez les pièces que vous avez mises de côté.", to: "/compte/favoris" },
  { icon: ShoppingBag, title: "Mon panier", body: "Reprenez votre sélection là où vous l'avez laissée.", to: "/panier" },
];

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40";

const labelClass =
  "mb-1.5 block text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground";

const ProfileSection = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);

    setSubmitting(true);
    try {
      await updateProfile({
        firstName: String(form.get("firstName") ?? ""),
        lastName: String(form.get("lastName") ?? ""),
        phone: String(form.get("phone") ?? "") || undefined,
      });
      toast("Profil mis à jour");
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-8 rounded-3xl border border-border bg-offwhite/50 p-7">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-foreground">Mes informations</h2>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Modifier mes informations"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:border-foreground/40"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={onSubmit} className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="firstName">Prénom</label>
            <input id="firstName" name="firstName" required defaultValue={user.firstName} className={fieldClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="lastName">Nom</label>
            <input id="lastName" name="lastName" required defaultValue={user.lastName} className={fieldClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="phone">Téléphone</label>
            <input id="phone" name="phone" type="tel" defaultValue={user.phone ?? ""} className={fieldClass} />
          </div>
          {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
          <div className="flex gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-full bg-foreground px-8 text-[0.7rem] uppercase tracking-[0.22em] text-background transition-all duration-500 hover:bg-foreground/90 disabled:opacity-60"
            >
              {submitting ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="h-11 rounded-full border border-foreground/20 px-8 text-[0.7rem] uppercase tracking-[0.22em] text-foreground transition-all duration-500 hover:bg-foreground/5"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">Nom complet</dt>
            <dd className="mt-1 text-foreground">{user.firstName} {user.lastName}</dd>
          </div>
          <div>
            <dt className="text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">E-mail</dt>
            <dd className="mt-1 text-foreground">{user.email}</dd>
          </div>
          <div>
            <dt className="text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">Téléphone</dt>
            <dd className="mt-1 text-foreground">{user.phone || "—"}</dd>
          </div>
        </dl>
      )}
    </div>
  );
};

const SecuritySection = () => {
  const { user, setUser } = useAuth();
  const [openForm, setOpenForm] = useState<"email" | "password" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const closeForm = () => {
    setOpenForm(null);
    setError(null);
  };

  const onSubmitEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      const updated = await changeEmail(
        String(form.get("currentPassword") ?? ""),
        String(form.get("newEmail") ?? ""),
      );
      setUser(updated);
      toast("Adresse e-mail mise à jour", {
        description: "Un e-mail de confirmation vous a été envoyé à votre nouvelle adresse.",
      });
      closeForm();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      await changePassword(
        String(form.get("currentPassword") ?? ""),
        String(form.get("newPassword") ?? ""),
      );
      toast("Mot de passe mis à jour");
      closeForm();
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-8 rounded-3xl border border-border bg-offwhite/50 p-7">
      <h2 className="font-serif text-2xl text-foreground">Sécurité</h2>

      {openForm === null && (
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setOpenForm("email")}
            className="h-11 rounded-full border border-foreground/20 px-6 text-[0.68rem] uppercase tracking-[0.2em] text-foreground transition-all duration-500 hover:bg-foreground/5"
          >
            Modifier mon e-mail
          </button>
          <button
            type="button"
            onClick={() => setOpenForm("password")}
            className="h-11 rounded-full border border-foreground/20 px-6 text-[0.68rem] uppercase tracking-[0.2em] text-foreground transition-all duration-500 hover:bg-foreground/5"
          >
            Changer le mot de passe
          </button>
        </div>
      )}

      {openForm === "email" && (
        <form onSubmit={onSubmitEmail} className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="newEmail">Nouvelle adresse e-mail</label>
            <input id="newEmail" name="newEmail" type="email" required defaultValue={user.email} className={fieldClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="currentPasswordEmail">Mot de passe actuel</label>
            <input id="currentPasswordEmail" name="currentPassword" type="password" required autoComplete="current-password" className={fieldClass} />
          </div>
          {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={submitting} className="h-11 rounded-full bg-foreground px-8 text-[0.7rem] uppercase tracking-[0.22em] text-background transition-all duration-500 hover:bg-foreground/90 disabled:opacity-60">
              {submitting ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button type="button" onClick={closeForm} className="h-11 rounded-full border border-foreground/20 px-8 text-[0.7rem] uppercase tracking-[0.22em] text-foreground transition-all duration-500 hover:bg-foreground/5">
              Annuler
            </button>
          </div>
        </form>
      )}

      {openForm === "password" && (
        <form onSubmit={onSubmitPassword} className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="currentPassword">Mot de passe actuel</label>
            <input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" className={fieldClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="newPassword">Nouveau mot de passe</label>
            <input id="newPassword" name="newPassword" type="password" required minLength={8} autoComplete="new-password" className={fieldClass} />
          </div>
          {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={submitting} className="h-11 rounded-full bg-foreground px-8 text-[0.7rem] uppercase tracking-[0.22em] text-background transition-all duration-500 hover:bg-foreground/90 disabled:opacity-60">
              {submitting ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button type="button" onClick={closeForm} className="h-11 rounded-full border border-foreground/20 px-8 text-[0.7rem] uppercase tracking-[0.22em] text-foreground transition-all duration-500 hover:bg-foreground/5">
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const Account = () => {
  const { user } = useAuth();

  return (
    <AccountLayout
      title="Mon compte"
      intro={
        user
          ? `Bienvenue, ${user.firstName}. Gérez vos commandes, vos adresses et vos pièces favorites.`
          : "Bienvenue dans votre espace. Gérez vos commandes, vos adresses et vos pièces favorites."
      }
    >
      <ProfileSection />
      <SecuritySection />

      <div className="grid gap-6 sm:grid-cols-2">
        {tiles.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group flex flex-col rounded-3xl border border-border bg-offwhite/50 p-7 transition-colors hover:border-foreground/30"
          >
            <div className="flex items-center justify-between">
              <t.icon className="h-5 w-5 text-foreground" strokeWidth={1.4} />
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" strokeWidth={1.5} />
            </div>
            <h2 className="mt-6 font-serif text-2xl text-foreground">{t.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
          </Link>
        ))}
      </div>
    </AccountLayout>
  );
};

export default Account;
