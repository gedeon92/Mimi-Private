import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cta } from "./Cta";
import slide1 from "@/assets/hero-slide-1.jpg";
import slide2 from "@/assets/hero-slide-2.jpg";
import slide3 from "@/assets/hero-slide-3.jpg";
import slide4 from "@/assets/hero-slide-4.jpg";

const slides = [
  {
    img: slide1,
    alt: "Campagne Mimi Cherry Private — silhouette éditoriale et sac sculptural",
  },
  {
    img: slide2,
    alt: "Campagne Mimi Cherry Private — modèle portant un sac signature",
  },
  {
    img: slide3,
    alt: "Campagne Mimi Cherry Private — composition luxe et lumière naturelle",
  },
  {
    img: slide4,
    alt: "Campagne Mimi Cherry Private — portrait éditorial et maroquinerie",
  },
];

const AUTOPLAY_MS = 6500;

export const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [index]);

  return (
    <section id="top" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink">
      {/* Slider — images dominate the screen */}
      <AnimatePresence>
        <motion.img
          key={index}
          src={slides[index].img}
          alt={slides[index].alt}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 6, ease: [0.22, 1, 0.36, 1] },
          }}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </AnimatePresence>

      {/* Cinematic gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-ink/40" />

      {/* Content — centered */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-5 pb-16 text-center md:px-10">
        <motion.p
          className="mb-5 text-xs uppercase tracking-[0.4em] text-ivory/80"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          Maison Privée Mimi Cherry
        </motion.p>
        <motion.h1
          className="max-w-3xl font-serif text-[3.2rem] leading-[0.94] text-ivory sm:text-7xl md:text-[5.5rem]"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.45 }}
        >
          Des pièces d'exception.
          <br />
          <span className="italic">Une signature unique.</span>
        </motion.h1>
        <motion.div
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <Cta href="/collection" className="bg-ivory text-ink border-ivory hover:bg-ivory/90">
            Découvrir la collection
          </Cta>
          <Cta
            href="#histoire"
            variant="ghost"
            className="text-ivory border-ivory/40 hover:border-ivory"
          >
            Notre histoire
          </Cta>
        </motion.div>
      </div>

      {/* Slide indicators — centered, discreet (no arrows) */}
      <div className="absolute bottom-8 left-5 z-20 flex items-center gap-2.5 md:left-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Aller à l'image ${i + 1}`}
            className="h-px transition-all duration-500"
            style={{
              width: i === index ? 40 : 18,
              backgroundColor: i === index ? "hsl(var(--ivory))" : "hsl(var(--ivory) / 0.4)",
            }}
          />
        ))}
      </div>
    </section>
  );
};
