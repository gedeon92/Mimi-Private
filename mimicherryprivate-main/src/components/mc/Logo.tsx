import logoMark from "@/assets/logo-mark.png";
import logoMarkWhite from "@/assets/logo-mark-white.png";

import logoCouleur from "@/assets/logo-couleur-light.png";

interface LogoProps {
  className?: string;
}

/**
 * Official Mimi Cherry Private logo (colour mark on transparent background).
 * Used over light surfaces — fully readable on ivory / warm white.
 */
export const BrandLogo = ({ className }: LogoProps) => (
  <img
    src={logoMark}
    alt="Mimi Cherry Private"
    className={className}
    width={832}
    height={540}
  />
);

/**
 * White version of the brand mark (transparent background).
 * Used over hero photography where the header is overlaid on dark images.
 */
export const BrandLogoLight = ({ className }: LogoProps) => (
  <img
    src={logoMarkWhite}
    alt="Mimi Cherry Private"
    className={className}
    width={832}
    height={540}
  />
);

/**
 * Official logo file ("logo officiel") — gris/blanc sur fond noir.
 * Its black background melts naturally into dark surfaces (footer).
 */
export const BrandLogoDark = ({ className }: LogoProps) => (
  <img
    src={logoCouleur}
    alt="Mimi Cherry Private"
    className={className}
    width={1000}
    height={1000}
  />
);

export const Wordmark = ({ className }: { className?: string }) => (
  <span className={className}>
    <span className="font-serif text-xl leading-none tracking-tight">Mimi Cherry</span>{" "}
    <span className="font-sans text-[0.6rem] uppercase tracking-[0.4em] align-middle">Private</span>
  </span>
);
