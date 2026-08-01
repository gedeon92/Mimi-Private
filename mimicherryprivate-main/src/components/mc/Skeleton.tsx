import { cn } from "@/lib/utils";

/** Bloc de chargement pulsé — remplace les écrans blancs/textes "Chargement…" pendant la récupération des données. */
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-lg bg-stone/60", className)} />
);
