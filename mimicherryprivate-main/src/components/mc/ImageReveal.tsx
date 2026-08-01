import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Editorial image reveal — the frame uncovers the image with a soft clip wipe.
 * Restrained and luxury: slow easing, runs once on scroll.
 */
export const ImageReveal = ({ children, className, delay = 0 }: ImageRevealProps) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{ overflow: "hidden" }}
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
