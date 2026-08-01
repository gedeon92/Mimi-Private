// Types du catalogue produit. Les données réelles viennent désormais de
// l'API (voir src/api/products.ts) et non plus d'un tableau statique ici.

/** Une teinte disponible : nom, pastille (couleur réelle), photo associée. */
export interface ProductColor {
  /** Identifiant réel de la variante en base — utilisé par le panier/favoris/commandes. */
  id: string;
  name: string;
  /** Valeur de la pastille (couleur réelle du cuir). */
  swatch: string;
  img: string;
  stock: number;
}

export interface Product {
  /** Identifiant public stable (slug), utilisé dans les URLs — ex. "standard". */
  id: string;
  line: string; // ex: "FORM 01"
  name: string; // ex: "Standard"
  /** Catégorie de la pièce, ex: "Sac", "Pochette", "Ensemble". */
  category: string;
  /** Référence modèle, ex: "FORM 01 · STD". */
  ref: string;
  price: string; // FCFA, formatté
  img: string;
  /** Courte ligne descriptive sous le nom. */
  detail: string;
  /** Description courte pour la fiche produit. */
  shortDescription: string;
  /** Mention discrète (ex: ensemble). Jamais une promotion. */
  tag?: string | null;
  /** Teintes disponibles — pilotent les pastilles et la galerie. */
  colors: ProductColor[];
  /** Récit éditorial de la pièce. */
  story: string;
  /** Intention du design. */
  designIntent: string;
  /** Matières utilisées. */
  materials: string;
  /** Fabrication artisanale. */
  craftsmanship: string;
  /** Conseils d'entretien. */
  care: string;
}
