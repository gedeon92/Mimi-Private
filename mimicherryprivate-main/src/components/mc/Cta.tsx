import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "solid" | "outline" | "ghost";

interface CtaProps extends ComponentPropsWithoutRef<"a"> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  solid:
    "bg-primary text-primary-foreground hover:bg-ink/90 border border-primary",
  outline:
    "bg-transparent text-foreground border border-foreground/40 hover:border-foreground hover:bg-foreground hover:text-background",
  ghost:
    "bg-transparent text-foreground border-b border-foreground/30 rounded-none px-0 py-1 hover:border-foreground",
};

/** Editorial CTA — generous tracking, restrained motion. */
export const Cta = ({ variant = "solid", className, children, ...props }: CtaProps) => (
  <a
    className={cn(
      "inline-flex items-center justify-center text-xs uppercase tracking-[0.28em] font-sans font-medium transition-all duration-500",
      variant !== "ghost" && "px-9 py-4 rounded-full",
      styles[variant],
      className
    )}
    {...props}
  >
    {children}
  </a>
);
