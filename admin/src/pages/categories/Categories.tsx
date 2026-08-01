import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { createCategory, deleteCategory, getCategories, updateCategory, type AdminCategory } from "@/api/categories";
import { ApiError } from "@/lib/api";

const Categories = () => {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["categories"] });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast("Catégorie supprimée");
      invalidate();
    },
    onError: (err) =>
      toast("Suppression impossible", { description: err instanceof ApiError ? err.message : undefined }),
  });

  const openCreate = () => {
    setEditing(null);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (category: AdminCategory) => {
    setEditing(category);
    setError(null);
    setModalOpen(true);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const name = String(new FormData(e.currentTarget).get("name") ?? "");
    try {
      if (editing) {
        await updateCategory(editing.id, name);
        toast("Catégorie mise à jour");
      } else {
        await createCategory(name);
        toast("Catégorie créée");
      }
      setModalOpen(false);
      invalidate();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow-accent mb-2">Catalogue</p>
          <h1 className="font-serif text-4xl text-foreground">Catégories</h1>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" strokeWidth={1.8} />
          Ajouter
        </Button>
      </div>

      {isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-3xl border border-border">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-offwhite/60 text-left text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Nom</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Produits associés</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories?.map((c) => (
                <tr key={c.id}>
                  <td className="px-6 py-4 font-serif text-base text-foreground">{c.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{c.slug}</td>
                  <td className="px-6 py-4 text-muted-foreground">{c.productCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        aria-label="Modifier"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors hover:border-foreground/40"
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Supprimer la catégorie « ${c.name} » ?`)) {
                            deleteMutation.mutate(c.id);
                          }
                        }}
                        aria-label="Supprimer"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier la catégorie" : "Nouvelle catégorie"}>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" required defaultValue={editing?.name} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            {editing ? "Enregistrer" : "Créer"}
          </Button>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Categories;
