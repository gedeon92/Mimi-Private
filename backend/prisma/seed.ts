import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@mimicherryprivate.com";
const ADMIN_PASSWORD = "AdminMCP2026!";

/**
 * Reprend telles quelles les 4 pièces déjà définies côté front
 * (mimicherryprivate-main/src/data/products.ts) pour que le catalogue affiché
 * ne change pas visuellement une fois branché sur l'API.
 *
 * `imageKey` correspond au nom de fichier (sans extension) dans
 * src/assets/products/ côté front — le front résout cette clé vers son asset
 * bundlé existant. Une fois l'upload Cloudinary en place (étape admin), ce
 * champ contiendra directement une URL absolue, sans changement de forme.
 */
const CARE_COMMON =
  "Protégez le cuir de l'humidité prolongée et de la lumière directe. Nourrissez la matière deux à trois fois par an avec un lait incolore. Rangez la pièce dans son écrin de coton, garnie de papier de soie pour préserver sa courbe.";

const CRAFT_COMMON =
  "Chaque pièce naît en petite série dans notre atelier. La courbe est tracée à la main, montée, puis contrôlée pièce par pièce avant de porter le monogramme. L'intention précède toujours le geste.";

const categories = [
  { name: "Sac", slug: "sac" },
  { name: "Pochette portefeuille", slug: "pochette-portefeuille" },
  { name: "Ensemble", slug: "ensemble" },
];

const products = [
  {
    categorySlug: "sac",
    line: "FORM 01",
    name: "Standard",
    slug: "standard",
    ref: "FORM 01 · STD",
    displayOrder: 0,
    price: 165_000,
    detail: "The Original Shape.",
    shortDescription:
      "La silhouette de référence de la maison. Le sac qui contient une journée entière, sans jamais perdre sa courbe sculpturale.",
    tag: null as string | null,
    story:
      "Le Standard est le point de départ de tout. La pièce autour de laquelle la maison s'est construite, une courbe née à Dakar, devenue signature. Il porte le quotidien comme une intention.",
    designIntent:
      "Dessiner un volume généreux qui reste léger à l'œil. La structure tient seule, la courbe adoucit, le monogramme s'efface pour laisser parler la ligne.",
    materials:
      "Cuir pleine fleur de premier choix, anse façonnée et renforcée. Doublure peau, poche intérieure plaquée, monogramme estampé à chaud.",
    craftsmanship: CRAFT_COMMON,
    care: CARE_COMMON,
    colors: [
      { name: "Fauve", swatch: "#c08a4e", imageKey: "std-fauve" },
      { name: "Chocolat", swatch: "#4a2c20", imageKey: "std-chocolat" },
      { name: "Rouge", swatch: "#9c1f24", imageKey: "std-rouge" },
      { name: "Olive", swatch: "#6b6a4b", imageKey: "std-olive" },
      { name: "Taupe", swatch: "#8a7551", imageKey: "std-camel" },
    ],
  },
  {
    categorySlug: "sac",
    line: "FORM 01",
    name: "Mini",
    slug: "mini",
    ref: "FORM 01 · MINI",
    displayOrder: 1,
    price: 150_000,
    detail: "A More Compact Expression.",
    shortDescription:
      "Le format réduit du modèle de référence. Une silhouette compacte et structurée, livrée avec sa bandoulière, pour celles qui voyagent léger.",
    tag: null as string | null,
    story:
      "Le Mini distille la présence du Standard dans un volume resserré. Une pièce du soir comme du jour, qui tient l'essentiel sans rien céder de la ligne.",
    designIntent:
      "Préserver l'équilibre des proportions à plus petite échelle. Chaque courbe est recalculée pour que la silhouette demeure aussi affirmée que sur le modèle d'origine.",
    materials:
      "Cuir pleine fleur, anse structurée et bandoulière amovible. Doublure peau, fermeture aimantée, monogramme estampé à chaud.",
    craftsmanship: CRAFT_COMMON,
    care: CARE_COMMON,
    colors: [
      { name: "Naturel", swatch: "#d8c39c", imageKey: "mini-naturel" },
      { name: "Caramel", swatch: "#b3743a", imageKey: "mini-caramel" },
      { name: "Bronze", swatch: "#8c6a3d", imageKey: "mini-bronze" },
      { name: "Python", swatch: "#b6a268", imageKey: "mini-python" },
      { name: "Turquoise", swatch: "#7bc0ad", imageKey: "mini-turquoise" },
      { name: "Rose", swatch: "#e0a8cf", imageKey: "mini-rose" },
    ],
  },
  {
    categorySlug: "pochette-portefeuille",
    line: "FORM 01",
    name: "Wallet",
    slug: "wallet",
    ref: "FORM 01 · WLT",
    displayOrder: 2,
    price: 65_000,
    detail: "Essential by Design.",
    shortDescription:
      "Une pochette portefeuille au format nomade, pensée pour l'essentiel. La courbe signature, réduite à sa plus pure expression.",
    tag: null as string | null,
    story:
      "Né comme le plus intime des objets de la maison, le Wallet accompagne le geste du quotidien. Glissée dans la main ou portée seule, la pochette condense l'élégance du FORM 01 dans un format qui ne quitte jamais.",
    designIntent:
      "Réduire sans appauvrir. Conserver la courbe iconique tout en effaçant le superflu, jusqu'à obtenir une ligne juste, tenue, intemporelle.",
    materials:
      "Cuir pleine fleur sélectionné pour son grain et sa tenue. Doublure peau, fermeture aimantée discrète, monogramme estampé à chaud.",
    craftsmanship: CRAFT_COMMON,
    care: CARE_COMMON,
    colors: [
      { name: "Naturel", swatch: "#c9a878", imageKey: "wlt-naturel" },
      { name: "Crème", swatch: "#d8c9a3", imageKey: "wlt-creme" },
      { name: "Blush", swatch: "#e9c3b4", imageKey: "wlt-blush" },
      { name: "Rose", swatch: "#e0a8cf", imageKey: "wlt-rose" },
      { name: "Rouge", swatch: "#9c1f24", imageKey: "wlt-rouge" },
      { name: "Orange", swatch: "#cf7a31", imageKey: "wlt-orange" },
      { name: "Chocolat", swatch: "#4a2c20", imageKey: "wlt-chocolat" },
      { name: "Olive", swatch: "#6b6a4b", imageKey: "wlt-olive" },
      { name: "Turquoise", swatch: "#a8d4cd", imageKey: "wlt-turquoise" },
    ],
  },
  {
    categorySlug: "ensemble",
    line: "FORM 01",
    name: "Set",
    slug: "set",
    ref: "FORM 01 · SET",
    displayOrder: 3,
    price: 215_000,
    detail: "Le Wallet et le Standard, pensés comme un tout.",
    shortDescription:
      "Le Wallet et le Standard réunis, pensés comme un tout. L'expression complète du FORM 01, dans une même teinte accordée.",
    tag: "L'ensemble",
    story:
      "L'ensemble réunit les deux gestes de la maison : la pièce qui porte la journée et celle qui garde l'intime. Accordés dans une même teinte, ils composent un dialogue, non une addition.",
    designIntent:
      "Penser deux objets comme une seule respiration. Les courbes se répondent, les teintes s'accordent, l'ensemble devient une évidence plutôt qu'un duo.",
    materials:
      "Cuir pleine fleur unique pour les deux pièces, teinté dans le même bain. Doublures peau, fermetures aimantées, monogrammes estampés à chaud.",
    craftsmanship: CRAFT_COMMON,
    care: CARE_COMMON,
    colors: [
      { name: "Caramel", swatch: "#b3743a", imageKey: "set-caramel" },
      { name: "Chocolat", swatch: "#4a2c20", imageKey: "set-chocolat" },
      { name: "Olive", swatch: "#6b6a4b", imageKey: "set-olive" },
      { name: "Rouge", swatch: "#9c1f24", imageKey: "set-rouge" },
      { name: "Rose", swatch: "#e0a8cf", imageKey: "set-rose" },
      { name: "Turquoise", swatch: "#a8d4cd", imageKey: "set-turquoise" },
    ],
  },
];

async function main() {
  const adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      passwordHash: adminPasswordHash,
      firstName: "Admin",
      lastName: "Mimi Cherry",
      role: "ADMIN",
    },
  });

  const categoryIdBySlug = new Map<string, string>();

  for (const c of categories) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
    categoryIdBySlug.set(c.slug, category.id);
  }

  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) throw new Error(`Catégorie inconnue: ${p.categorySlug}`);

    const product = await prisma.product.upsert({
      where: { ref: p.ref },
      update: {
        categoryId,
        line: p.line,
        name: p.name,
        slug: p.slug,
        displayOrder: p.displayOrder,
        price: p.price,
        detail: p.detail,
        shortDescription: p.shortDescription,
        story: p.story,
        designIntent: p.designIntent,
        materials: p.materials,
        craftsmanship: p.craftsmanship,
        care: p.care,
        tag: p.tag,
      },
      create: {
        categoryId,
        line: p.line,
        name: p.name,
        slug: p.slug,
        ref: p.ref,
        displayOrder: p.displayOrder,
        price: p.price,
        detail: p.detail,
        shortDescription: p.shortDescription,
        story: p.story,
        designIntent: p.designIntent,
        materials: p.materials,
        craftsmanship: p.craftsmanship,
        care: p.care,
        tag: p.tag,
      },
    });

    for (const color of p.colors) {
      const sku = `${p.ref}-${color.name}`.toUpperCase().replace(/\s+/g, "-");

      const variant = await prisma.productVariant.upsert({
        where: { productId_colorName: { productId: product.id, colorName: color.name } },
        update: { swatchHex: color.swatch, sku },
        create: {
          productId: product.id,
          colorName: color.name,
          swatchHex: color.swatch,
          sku,
          stock: 25,
        },
      });

      const existingImage = await prisma.productImage.findFirst({
        where: { variantId: variant.id },
      });
      if (!existingImage) {
        await prisma.productImage.create({
          data: { variantId: variant.id, url: color.imageKey, position: 0 },
        });
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Seed terminé : ${categories.length} catégories, ${products.length} produits.`);
  console.log(`Compte admin : ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
