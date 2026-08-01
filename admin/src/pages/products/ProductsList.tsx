import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { getAdminProducts, deleteProduct } from "@/api/products";
import { getCategories } from "@/api/categories";
import { ApiError } from "@/lib/api";
import { resolveImage } from "@/lib/images";

const formatFcfa = (n: number) => n.toLocaleString("fr-FR").replace(/[  ,]/g, " ");

const ProductsList = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"" | "active" | "inactive">("");

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", search, category, status],
    queryFn: () =>
      getAdminProducts({
        search: search || undefined,
        category: category || undefined,
        status: status || undefined,
        limit: 50,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast("Produit supprimé");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err) => toast("Suppression impossible", { description: err instanceof ApiError ? err.message : undefined }),
  });

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow-accent mb-2">Catalogue</p>
          <h1 className="font-serif text-4xl text-foreground">Produits</h1>
        </div>
        <Link to="/produits/nouveau">
          <Button>
            <Plus className="h-4 w-4" strokeWidth={1.8} />
            Ajouter un produit
          </Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative w-64">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.6} />
          <Input placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-52">
          <option value="">Toutes les catégories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="w-48">
          <option value="">Tous les statuts</option>
          <option value="active">Disponible</option>
          <option value="inactive">Indisponible</option>
        </Select>
      </div>

      {isLoading ? (
        <p className="mt-10 text-sm text-muted-foreground">Chargement…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-border">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-offwhite/60 text-left text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Prix</th>
                <th className="px-6 py-4">Stock total</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.items.map((p) => {
                const totalStock = p.variants.reduce((n, v) => n + v.stock, 0);
                const mainImage = p.variants[0]?.images[0]?.url;
                return (
                  <tr key={p.id}>
                    <td className="px-6 py-4">
                      <Link to={`/produits/${p.id}`} className="flex items-center gap-3">
                        <div className="h-12 w-10 shrink-0 overflow-hidden rounded-md bg-offwhite">
                          {mainImage && (
                            <img src={resolveImage(mainImage)} alt={p.name} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="link-underline font-medium text-foreground">{p.line} {p.name}</p>
                          <p className="text-[0.66rem] text-muted-foreground">{p.ref}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{p.category.name}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">{formatFcfa(p.price)} FCFA</td>
                    <td className="px-6 py-4">
                      <span className={totalStock === 0 ? "text-destructive" : "text-muted-foreground"}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge tone={p.isActive ? "success" : "default"}>
                        {p.isActive ? "Disponible" : "Indisponible"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/produits/${p.id}`}
                          className="flex h-8 items-center rounded-full border border-foreground/15 px-3 text-[0.64rem] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-foreground/40"
                        >
                          Modifier
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Supprimer « ${p.name} » définitivement ?`)) {
                              deleteMutation.mutate(p.id);
                            }
                          }}
                          className="flex h-8 items-center rounded-full border border-foreground/15 px-3 text-[0.64rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {data?.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    Aucun produit trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default ProductsList;
