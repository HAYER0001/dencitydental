"use client";

import { useRef } from "react";
import { motion, useSpring, useMotionValue, useReducedMotion } from "framer-motion";

interface MagneticProps {
  children: React.ReactElement;
  /** Fraction of the cursor's offset-from-centre the element travels (0–1). */
  strength?: number;
  /** Adds a slow-pulse, brand-teal glow on hover (see `.magnetic-glow` in globals.css). */
  glow?: boolean;
  /** Extra classes on the wrapper — e.g. `block w-full` to stay layout-neutral. */
  className?: string;
}

/**
 * High-damping spring: heavy and expensive, settling without any jiggle — the
 * pull should feel like weighted glass, not a rubber band.
 */
const SPRING = { stiffness: 150, damping: 20, mass: 0.7 } as const;

export default function Magnetic({
  children,
  strength = 0.35,
  glow = false,
  className = "",
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const x = useSpring(mvX, SPRING);
  const y = useSpring(mvY, SPRING);

  // Element-scoped: the rect is measured only while the cursor is over this one
  // element (never a global mousemove), so many magnetic CTAs stay cheap.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mvX.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    mvY.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    mvX.set(0);
    mvY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ x: reduceMotion ? 0 : x, y: reduceMotion ? 0 : y }}
      className={`inline-block ${glow ? "magnetic-glow" : ""} ${className}`.trim()}
    >
      {children}
    </motion.div>
  );
}
