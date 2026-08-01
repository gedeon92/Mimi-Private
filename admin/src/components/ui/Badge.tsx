import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Badge = ({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "destructive";
}) => {
  const tones = {
    default: "bg-foreground/10 text-foreground",
    success: "bg-success/15 text-success",
    warning: "bg-gold/20 text-gold",
    destructive: "bg-destructive/15 text-destructive",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em]",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
};
