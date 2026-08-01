import { useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Loader2, Plus, Star, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Field";
import { getCategories } from "@/api/categories";
import {
  addImage,
  addVariant,
  createProduct,
  getAdminProduct,
  removeImage,
  removeVariant,
  setMainImage,
  updateProduct,
  updateVariant,
  type AdminProduct,
  type AdminVariant,
} from "@/api/products";
import { uploadImage } from "@/api/uploads";
import { ApiError } from "@/lib/api";
import { resolveImage } from "@/lib/images";

const fieldGroup = "grid gap-5 sm:grid-cols-2";

const VariantCard = ({ variant, productId }: { variant: AdminVariant; productId: string }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });

  const updateMutation = useMutation({
    mutationFn: (data: { stock?: number; colorName?: string; swatchHex?: string }) =>
      updateVariant(variant.id, data),
    onSuccess: () => {
      toast("Teinte mise à jour");
      invalidate();
    },
    onError: (err) => toast("Erreur", { description: err instanceof ApiError ? err.message : undefined }),
  });

  const removeVariantMutation = useMutation({
    mutationFn: () => removeVariant(variant.id),
    onSuccess: () => {
      toast("Teinte supprimée");
      invalidate();
    },
  });

  const removeImageMutation = useMutation({
    mutationFn: (imageId: string) => removeImage(imageId),
    onSuccess: invalidate,
  });

  const setMainMutation = useMutation({
    mutationFn: (imageId: string) => setMainImage(imageId),
    onSuccess: invalidate,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url, publicId } = await uploadImage(file);
      await addImage(variant.id, url, variant.images.length, publicId);
      invalidate();
      toast("Image ajoutée");
    } catch (err) {
      toast("Échec de l'upload", { description: err instanceof ApiError ? err.message : undefined });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onStockBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const stock = Number(e.target.value);
    if (!Number.isNaN(stock) && stock !== variant.stock) {
      updateMutation.mutate({ stock });
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="h-6 w-6 shrink-0 rounded-full ring-1 ring-border"
            style={{ backgroundColor: variant.swatchHex }}
          />
          <div>
            <p className="font-medium text-foreground">{variant.colorName}</p>
            <p className="text-[0.64rem] text-muted-foreground">{variant.sku}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Supprimer la teinte « ${variant.colorName} » ?`)) {
              removeVariantMutation.mutate();
            }
          }}
          aria-label="Supprimer la teinte"
          className="text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Label htmlFor={`stock-${variant.id}`}>Stock</Label>
        <Input
          id={`stock-${variant.id}`}
          type="number"
          min={0}
          defaultValue={variant.stock}
          onBlur={onStockBlur}
          className="h-9 w-24"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {variant.images.map((img, i) => (
          <div key={img.id} className="group relative h-16 w-14 overflow-hidden rounded-md bg-offwhite">
            <img
              src={resolveImage(img.url)}
              alt=""
              width={56}
              height={64}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            {i === 0 && (
              <span className="absolute left-0.5 top-0.5 rounded-full bg-foreground/80 p-0.5">
                <Star className="h-2.5 w-2.5 text-background" fill="currentColor" />
              </span>
            )}
            <div className="absolute inset-0 hidden items-center justify-center gap-1 bg-ink/60 group-hover:flex">
              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => setMainMutation.mutate(img.id)}
                  aria-label="Définir comme image principale"
                  className="text-ivory hover:text-gold"
                >
                  <Star className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImageMutation.mutate(img.id)}
                aria-label="Supprimer l'image"
                className="text-ivory hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
        <label
          className={`flex h-16 w-14 shrink-0 items-center justify-center rounded-md border border-dashed transition-colors ${
            uploading
              ? "cursor-wait border-foreground/40 text-foreground"
              : "cursor-pointer border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
          }`}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          ) : (
            <Upload className="h-4 w-4" strokeWidth={1.5} />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

const AddVariantForm = ({ productId }: { productId: string }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: { colorName: string; swatchHex: string; sku: string; stock: number }) =>
      addVariant(productId, payload),
    onSuccess: () => {
      toast("Teinte ajoutée");
      queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
      setOpen(false);
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Une erreur est survenue."),
  });

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-full min-h-[140px] w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
      >
        <Plus className="h-4 w-4" strokeWidth={1.6} />
        Ajouter une teinte
      </button>
    );
  }

  return (
    <form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const form = new FormData(e.currentTarget);
        mutation.mutate({
          colorName: String(form.get("colorName") ?? ""),
          swatchHex: String(form.get("swatchHex") ?? "#000000"),
          sku: String(form.get("sku") ?? ""),
          stock: Number(form.get("stock") ?? 0),
        });
      }}
      className="rounded-2xl border border-border bg-background p-5"
    >
      <div className="space-y-3">
        <div>
          <Label htmlFor="colorName">Nom de la teinte</Label>
          <Input id="colorName" name="colorName" required placeholder="ex. Fauve" />
        </div>
        <div className="flex items-end gap-3">
          <div>
            <Label htmlFor="swatchHex">Couleur</Label>
            <input id="swatchHex" name="swatchHex" type="color" defaultValue="#8a7551" className="h-11 w-14 rounded-lg border border-border" />
          </div>
          <div className="flex-1">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" name="sku" required placeholder="ex. STD-FAUVE" />
          </div>
        </div>
        <div>
          <Label htmlFor="stock">Stock initial</Label>
          <Input id="stock" name="stock" type="number" min={0} defaultValue={0} />
        </div>
        {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
        <div className="flex gap-2 pt-1">
          <Button type="submit" size="sm">Ajouter</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Annuler</Button>
        </div>
      </div>
    </form>
  );
};

const ProductBaseForm = ({ product }: { product?: AdminProduct }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      categoryId: String(form.get("categoryId") ?? ""),
      line: String(form.get("line") ?? ""),
      name: String(form.get("name") ?? ""),
      ref: String(form.get("ref") ?? ""),
      price: Number(form.get("price") ?? 0),
      detail: String(form.get("detail") ?? ""),
      shortDescription: String(form.get("shortDescription") ?? ""),
      story: String(form.get("story") ?? ""),
      designIntent: String(form.get("designIntent") ?? ""),
      materials: String(form.get("materials") ?? ""),
      craftsmanship: String(form.get("craftsmanship") ?? ""),
      care: String(form.get("care") ?? ""),
      tag: String(form.get("tag") ?? "") || undefined,
      isActive: form.get("isActive") === "on",
      displayOrder: Number(form.get("displayOrder") ?? 0),
    };

    setSubmitting(true);
    try {
      if (product) {
        await updateProduct(product.id, payload);
        toast("Produit mis à jour");
        queryClient.invalidateQueries({ queryKey: ["admin-product", product.id] });
        queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      } else {
        const created = await createProduct(payload);
        toast("Produit créé — ajoutez maintenant ses teintes et images");
        navigate(`/produits/${created.id}`, { replace: true });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-3xl border border-border bg-offwhite/50 p-7">
      <div className={fieldGroup}>
        <div>
          <Label htmlFor="categoryId">Catégorie</Label>
          <Select id="categoryId" name="categoryId" required defaultValue={product?.categoryId}>
            <option value="" disabled>Choisir…</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="tag">Mention discrète (optionnel)</Label>
          <Input id="tag" name="tag" defaultValue={product?.tag ?? ""} placeholder="ex. L'ensemble" />
        </div>
        <div>
          <Label htmlFor="line">Ligne</Label>
          <Input id="line" name="line" required defaultValue={product?.line} placeholder="ex. FORM 01" />
        </div>
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" required defaultValue={product?.name} placeholder="ex. Standard" />
        </div>
        <div>
          <Label htmlFor="ref">Référence</Label>
          <Input id="ref" name="ref" required defaultValue={product?.ref} placeholder="ex. FORM 01 · STD" />
        </div>
        <div>
          <Label htmlFor="price">Prix (FCFA)</Label>
          <Input id="price" name="price" type="number" min={0} required defaultValue={product?.price} />
        </div>
        <div>
          <Label htmlFor="detail">Ligne descriptive courte</Label>
          <Input id="detail" name="detail" defaultValue={product?.detail} placeholder="ex. The Original Shape." />
        </div>
        <div>
          <Label htmlFor="displayOrder">Ordre d'affichage</Label>
          <Input id="displayOrder" name="displayOrder" type="number" defaultValue={product?.displayOrder ?? 0} />
        </div>
      </div>

      <div>
        <Label htmlFor="shortDescription">Description courte (fiche produit)</Label>
        <Textarea id="shortDescription" name="shortDescription" defaultValue={product?.shortDescription} />
      </div>
      <div>
        <Label htmlFor="story">Histoire de la pièce</Label>
        <Textarea id="story" name="story" defaultValue={product?.story} />
      </div>
      <div className={fieldGroup}>
        <div>
          <Label htmlFor="designIntent">Intention du design</Label>
          <Textarea id="designIntent" name="designIntent" defaultValue={product?.designIntent} />
        </div>
        <div>
          <Label htmlFor="materials">Matières / caractéristiques</Label>
          <Textarea id="materials" name="materials" defaultValue={product?.materials} />
        </div>
        <div>
          <Label htmlFor="craftsmanship">Fabrication</Label>
          <Textarea id="craftsmanship" name="craftsmanship" defaultValue={product?.craftsmanship} />
        </div>
        <div>
          <Label htmlFor="care">Entretien</Label>
          <Textarea id="care" name="care" defaultValue={product?.care} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} className="h-4 w-4 rounded border-border" />
        Produit disponible (visible côté client)
      </label>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Enregistrement…" : product ? "Enregistrer les modifications" : "Créer le produit"}
      </Button>
    </form>
  );
};

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { data: product, isLoading } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: () => getAdminProduct(id!),
    enabled: isEdit,
  });

  if (isEdit && isLoading) {
    return (
      <AdminLayout>
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <button
        type="button"
        onClick={() => navigate("/produits")}
        className="link-underline mb-6 inline-flex items-center gap-1 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground"
      >
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.6} />
        Retour aux produits
      </button>

      <p className="eyebrow-accent mb-2">{isEdit ? "Modifier" : "Nouveau"}</p>
      <h1 className="font-serif text-4xl text-foreground">{isEdit ? product?.name : "Nouveau produit"}</h1>

      <div className="mt-8 grid gap-8">
        <ProductBaseForm product={product} />

        {product && (
          <div>
            <h2 className="font-serif text-2xl text-foreground">Teintes et images</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {product.variants.map((v) => (
                <VariantCard key={v.id} variant={v} productId={product.id} />
              ))}
              <AddVariantForm productId={product.id} />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
