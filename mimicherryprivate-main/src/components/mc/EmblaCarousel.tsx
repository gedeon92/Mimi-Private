import { useCallback, useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmblaCarouselProps {
  /** Each child becomes a slide. Control per-slide width via slideClassName. */
  children: ReactNode[];
  /** Tailwind basis/width applied to every slide wrapper. */
  slideClassName?: string;
  /** Left padding (gap) applied to each slide. Defaults to "pl-4". */
  slideGapClassName?: string;
  /** Negative left margin on the track, must match slideGapClassName. Defaults to "-ml-4". */
  trackGapClassName?: string;
  /** Gap between slides (Tailwind pl-* value handled internally). */
  className?: string;
  /** Autoplay interval in ms. */
  autoplayDelay?: number;
  /** Show dots + arrows. Defaults to true. */
  controls?: boolean;
  /** Show navigation arrows. Defaults to true. Set false to keep only dots. */
  showArrows?: boolean;
  /** Loop the carousel. Defaults to true. */
  loop?: boolean;
  /** Align slides. Defaults to "start". */
  align?: "start" | "center";
  /** Control colours: "dark" for light controls on dark backgrounds. */
  tone?: "light" | "dark";
}

/**
 * Carrousel éditorial réutilisable — défilement automatique lent, swipe mobile,
 * transitions douces. Esthétique quiet luxury : commandes discrètes.
 */
export const EmblaCarousel = ({
  children,
  slideClassName,
  slideGapClassName = "pl-4",
  trackGapClassName = "-ml-4",
  className,
  autoplayDelay = 4500,
  controls = true,
  showArrows = true,
  loop = true,
  align = "start",
  tone = "light",
}: EmblaCarouselProps) => {
  const dark = tone === "dark";
  const dotActive = dark ? "bg-ivory" : "bg-foreground";
  const dotIdle = dark ? "bg-ivory/30 hover:bg-ivory/60" : "bg-foreground/25 hover:bg-foreground/50";
  const arrow = dark
    ? "border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink"
    : "border-foreground/20 text-foreground hover:border-foreground hover:bg-foreground hover:text-background";
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align, dragFree: false, duration: 20 }, [
    Autoplay({ delay: autoplayDelay, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className={cn("flex", trackGapClassName)}>
          {children.map((child, i) => (
            <div key={i} className={cn("min-w-0 shrink-0 grow-0", slideGapClassName, slideClassName)}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {controls && (
        <div className="mt-7 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {snaps.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Aller au visuel ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={cn(
                  "h-px transition-all duration-500",
                  selected === i ? `w-10 ${dotActive}` : `w-5 ${dotIdle}`
                )}
              />
            ))}
          </div>
          {showArrows && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Visuel précédent"
                onClick={() => emblaApi?.scrollPrev()}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500",
                  arrow
                )}
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.4} />
              </button>
              <button
                type="button"
                aria-label="Visuel suivant"
                onClick={() => emblaApi?.scrollNext()}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500",
                  arrow
                )}
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
