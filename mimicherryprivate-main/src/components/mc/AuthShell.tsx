import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/mc/Logo";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Cadre éditorial partagé par les écrans de compte (connexion, inscription,
 * mot de passe oublié). Sobre, centré, fidèle à l'univers de la maison.
 */
export const AuthShell = ({ eyebrow, title, subtitle, children, footer }: AuthShellProps) => (
  <div className="flex min-h-screen flex-col bg-background">
    <header className="flex items-center justify-center px-5 py-7 md:py-9">
      <Link to="/" aria-label="Mimi Cherry Private — accueil">
        <BrandLogo className="h-10 w-auto md:h-12" />
      </Link>
    </header>

    <main className="flex flex-1 items-center justify-center px-5 pb-20 pt-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="eyebrow-accent mb-4">{eyebrow}</p>
          <h1 className="font-serif text-4xl leading-none text-foreground md:text-5xl">{title}</h1>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div className="mt-10">{children}</div>

        {footer && (
          <div className="mt-8 text-center text-sm text-muted-foreground">{footer}</div>
        )}
      </div>
    </main>
  </div>
);

interface FieldProps {
  id: string;
  name?: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
}

export const AuthField = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  required = true,
  defaultValue,
}: FieldProps) => (
  <div className="text-left">
    <label
      htmlFor={id}
      className="block text-[0.62rem] uppercase tracking-[0.25em] text-muted-foreground"
    >
      {label}
    </label>
    <input
      id={id}
      name={name ?? id}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required={required}
      defaultValue={defaultValue}
      className="mt-2 h-12 w-full rounded-full border border-foreground/15 bg-background px-5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground/40"
    />
  </div>
);

export const AuthSubmit = ({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) => (
  <button
    type="submit"
    disabled={disabled}
    className="h-12 w-full rounded-full bg-foreground text-[0.7rem] uppercase tracking-[0.22em] text-background transition-all duration-500 hover:bg-foreground/90 disabled:opacity-60"
  >
    {children}
  </button>
);
