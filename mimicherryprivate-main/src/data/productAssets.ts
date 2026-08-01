// Registre des photos produit déjà optimisées par Vite (dossier 02_Products).
// L'API renvoie une `imageKey` par teinte (ex. "std-fauve") ; ce fichier la
// résout vers l'asset bundlé correspondant. Le jour où l'admin uploade de
// nouvelles images sur Cloudinary, l'API renverra directement une URL absolue
// et cette résolution locale n'aura plus lieu d'être pour ces images-là.

// FORM 01 STANDARD
import stdChocolat from "@/assets/products/std-chocolat.jpg";
import stdRouge from "@/assets/products/std-rouge.jpg";
import stdFauve from "@/assets/products/std-fauve.jpg";
import stdOlive from "@/assets/products/std-olive.jpg";
import stdCamel from "@/assets/products/std-camel.jpg";

// FORM 01 MINI
import miniBronze from "@/assets/products/mini-bronze.jpg";
import miniPython from "@/assets/products/mini-python.jpg";
import miniTurquoise from "@/assets/products/mini-turquoise.jpg";
import miniNaturel from "@/assets/products/mini-naturel.jpg";
import miniCaramel from "@/assets/products/mini-caramel.jpg";
import miniRose from "@/assets/products/mini-rose.jpg";

// FORM 01 WALLET
import wltNaturel from "@/assets/products/wlt-naturel.jpg";
import wltCreme from "@/assets/products/wlt-creme.jpg";
import wltBlush from "@/assets/products/wlt-blush.jpg";
import wltRose from "@/assets/products/wlt-rose.jpg";
import wltRouge from "@/assets/products/wlt-rouge.jpg";
import wltOrange from "@/assets/products/wlt-orange.jpg";
import wltChocolat from "@/assets/products/wlt-chocolat.jpg";
import wltOlive from "@/assets/products/wlt-olive.jpg";
import wltTurquoise from "@/assets/products/wlt-turquoise.jpg";

// FORM 01 SET
import setTurquoise from "@/assets/products/set-turquoise.jpg";
import setCaramel from "@/assets/products/set-caramel.jpg";
import setOlive from "@/assets/products/set-olive.jpg";
import setChocolat from "@/assets/products/set-chocolat.jpg";
import setRouge from "@/assets/products/set-rouge.jpg";
import setRose from "@/assets/products/set-rose.jpg";

const productAssets: Record<string, string> = {
  "std-chocolat": stdChocolat,
  "std-rouge": stdRouge,
  "std-fauve": stdFauve,
  "std-olive": stdOlive,
  "std-camel": stdCamel,
  "mini-bronze": miniBronze,
  "mini-python": miniPython,
  "mini-turquoise": miniTurquoise,
  "mini-naturel": miniNaturel,
  "mini-caramel": miniCaramel,
  "mini-rose": miniRose,
  "wlt-naturel": wltNaturel,
  "wlt-creme": wltCreme,
  "wlt-blush": wltBlush,
  "wlt-rose": wltRose,
  "wlt-rouge": wltRouge,
  "wlt-orange": wltOrange,
  "wlt-chocolat": wltChocolat,
  "wlt-olive": wltOlive,
  "wlt-turquoise": wltTurquoise,
  "set-turquoise": setTurquoise,
  "set-caramel": setCaramel,
  "set-olive": setOlive,
  "set-chocolat": setChocolat,
  "set-rouge": setRouge,
  "set-rose": setRose,
};

const API_ORIGIN = (import.meta.env.VITE_API_URL ?? "http://localhost:4000/api").replace(/\/api\/?$/, "");

/**
 * Résout la valeur `image` renvoyée par l'API vers une source affichable :
 * - URL absolue (http/https) → utilisée telle quelle ;
 * - chemin `/uploads/...` (upload admin, stockage disque backend) → préfixé
 *   par l'origine de l'API ;
 * - clé historique (ex. "std-fauve") → résolue vers l'asset bundlé Vite.
 */
export const resolveProductImage = (image: string | undefined): string => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/uploads/")) return `${API_ORIGIN}${image}`;
  return productAssets[image] || "";
};
