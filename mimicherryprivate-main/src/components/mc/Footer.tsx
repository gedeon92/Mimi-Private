import { Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLogoDark } from "./Logo";

interface FooterLink {
  label: string;
  to?: string;
  href?: string;
}

const groups: { title: string; links: FooterLink[] }[] = [
  {
    title: "Boutique",
    links: [
      { label: "La collection", to: "/collection" },
      { label: "Mon panier", to: "/panier" },
      { label: "Mon compte", to: "/compte" },
      { label: "Nous contacter", to: "/contact" },
    ],
  },
  {
    title: "La maison",
    links: [
      { label: "Notre histoire", to: "/notre-histoire" },
      { label: "L'Univers", to: "/savoir-faire" },
      { label: "Journal", href: "/#histoire" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Service",
    links: [
      { label: "Livraison", to: "/livraison" },
      { label: "Retours & échanges", to: "/retours" },
      { label: "Entretien du cuir", to: "/entretien-du-cuir" },
      { label: "FAQ", to: "/faq" },
    ],
  },
];

export const Footer = () => (
  <footer className="bg-ink text-ivory">
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <BrandLogoDark className="h-20 w-auto" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-ivory/70">
            Maroquinerie sculpturale née à Dakar. L'élégance dessinée autrement.
          </p>
          <div className="mt-7 flex gap-4">
            <a href="https://www.instagram.com/mimicherryprivate?igsh=dWJoM3F5dGF3bnY4" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full border border-ivory/25 p-2.5 transition-colors hover:bg-ivory hover:text-ink">
              <Instagram className="h-4 w-4" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {groups.map((g) => (
          <div key={g.title}>
            <h4 className="text-xs uppercase tracking-[0.25em] text-ivory/50">{g.title}</h4>
            <ul className="mt-5 space-y-3">
              {g.links.map((l) => (
                <li key={l.label}>
                  {l.to ? (
                    <Link
                      to={l.to}
                      className="link-underline text-sm text-ivory/80 hover:text-ivory"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      href={l.href}
                      className="link-underline text-sm text-ivory/80 hover:text-ivory"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-col gap-4 border-t border-ivory/15 pt-7 text-xs text-ivory/55 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Mimi Cherry Private. Tous droits réservés.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-ivory">Mentions légales</a>
          <a href="#" className="hover:text-ivory">Confidentialité</a>
          <a href="#" className="hover:text-ivory">Prix en FCFA</a>
        </div>
      </div>
    </div>
  </footer>
);
