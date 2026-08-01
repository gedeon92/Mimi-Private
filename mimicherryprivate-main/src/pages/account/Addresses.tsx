import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { AccountLayout, AccountEmpty } from "@/components/mc/AccountLayout";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
  type Address,
  type AddressPayload,
} from "@/api/addresses";
import { ApiError } from "@/lib/api";

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40";

const labelClass =
  "mb-1.5 block text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground";

const emptyForm: AddressPayload = {
  label: "",
  firstName: "",
  lastName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  country: "Sénégal",
  isDefault: false,
};

const AddressForm = ({
  initial,
  onCancel,
  onSaved,
}: {
  initial?: Address;
  onCancel: () => void;
  onSaved: () => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload: AddressPayload = {
      label: String(form.get("label") ?? ""),
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      line1: String(form.get("line1") ?? ""),
      line2: String(form.get("line2") ?? "") || undefined,
      city: String(form.get("city") ?? ""),
      country: String(form.get("country") ?? "Sénégal"),
      isDefault: form.get("isDefault") === "on",
    };

    setSubmitting(true);
    try {
      if (initial) {
        await updateAddress(initial.id, payload);
      } else {
        await createAddress(payload);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  const defaults = initial ?? emptyForm;

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-border bg-offwhite/50 p-7"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="label">Libellé</label>
          <input
            id="label"
            name="label"
            required
            defaultValue={defaults.label}
            placeholder="Domicile, Bureau…"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="firstName">Prénom</label>
          <input id="firstName" name="firstName" required defaultValue={defaults.firstName} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="lastName">Nom</label>
          <input id="lastName" name="lastName" required defaultValue={defaults.lastName} className={fieldClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="phone">Téléphone</label>
          <input id="phone" name="phone" type="tel" required defaultValue={defaults.phone} className={fieldClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="line1">Adresse</label>
          <input id="line1" name="line1" required defaultValue={defaults.line1} className={fieldClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="line2">Complément (optionnel)</label>
          <input id="line2" name="line2" defaultValue={defaults.line2 ?? ""} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="city">Ville</label>
          <input id="city" name="city" required defaultValue={defaults.city} className={fieldClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="country">Pays</label>
          <input id="country" name="country" required defaultValue={defaults.country} className={fieldClass} />
        </div>
      </div>

      <label className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={defaults.isDefault}
          className="h-4 w-4 rounded border-border"
        />
        Définir comme adresse par défaut
      </label>

      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="h-11 rounded-full bg-foreground px-8 text-[0.7rem] uppercase tracking-[0.22em] text-background transition-all duration-500 hover:bg-foreground/90 disabled:opacity-60"
        >
          {submitting ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-full border border-foreground/20 px-8 text-[0.7rem] uppercase tracking-[0.22em] text-foreground transition-all duration-500 hover:bg-foreground/5"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

const Addresses = () => {
  const queryClient = useQueryClient();
  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["addresses"] });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      toast("Adresse supprimée");
      invalidate();
    },
    onError: (err) =>
      toast("Impossible de supprimer cette adresse", {
        description: err instanceof ApiError ? err.message : undefined,
      }),
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => updateAddress(id, { isDefault: true }),
    onSuccess: invalidate,
  });

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSaved = () => {
    toast(editing ? "Adresse mise à jour" : "Adresse ajoutée");
    closeForm();
    invalidate();
  };

  if (isLoading) {
    return (
      <AccountLayout title="Mes adresses" intro="Gérez vos adresses de livraison et de facturation.">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title="Mes adresses" intro="Gérez vos adresses de livraison et de facturation.">
      {formOpen ? (
        <AddressForm initial={editing ?? undefined} onCancel={closeForm} onSaved={handleSaved} />
      ) : !addresses || addresses.length === 0 ? (
        <AccountEmpty
          title="Aucune adresse enregistrée"
          body="Ajoutez une adresse pour accélérer vos prochaines commandes."
          cta={
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="inline-flex h-11 items-center justify-center rounded-full border border-foreground/20 px-8 text-[0.7rem] uppercase tracking-[0.22em] text-foreground transition-all duration-500 hover:bg-foreground hover:text-background"
            >
              Ajouter une adresse
            </button>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {addresses.map((a) => (
              <div
                key={a.id}
                className="rounded-3xl border border-border bg-offwhite/50 p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg text-foreground">{a.label}</h3>
                      {a.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.18em] text-foreground">
                          <Star className="h-3 w-3" strokeWidth={1.5} fill="currentColor" />
                          Par défaut
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {a.firstName} {a.lastName}
                      <br />
                      {a.line1}
                      {a.line2 ? <>, {a.line2}</> : null}
                      <br />
                      {a.city}, {a.country}
                      <br />
                      {a.phone}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      aria-label="Modifier l'adresse"
                      onClick={() => {
                        setEditing(a);
                        setFormOpen(true);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:border-foreground/40"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      aria-label="Supprimer l'adresse"
                      onClick={() => {
                        if (window.confirm(`Supprimer l'adresse « ${a.label} » ?`)) {
                          deleteMutation.mutate(a.id);
                        }
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
                {!a.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefaultMutation.mutate(a.id)}
                    className="link-underline mt-5 text-[0.66rem] uppercase tracking-[0.2em] text-foreground"
                  >
                    Définir par défaut
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="inline-flex h-11 items-center justify-center rounded-full border border-foreground/20 px-8 text-[0.7rem] uppercase tracking-[0.22em] text-foreground transition-all duration-500 hover:bg-foreground hover:text-background"
          >
            Ajouter une adresse
          </button>
        </div>
      )}
    </AccountLayout>
  );
};

export default Addresses;
