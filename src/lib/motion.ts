import type { Transition, Variants } from "framer-motion";

/** Seconds, mirroring --duration-* in globals.css. */
export const durations = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
} as const;

/** Cubic-bezier curves mirroring --ease-* in globals.css. */
export const easings: Record<"outSoft" | "outExpo", [number, number, number, number]> = {
  outSoft: [0.25, 0.46, 0.45, 0.94],
  outExpo: [0.16, 1, 0.3, 1],
};

export const transitions = {
  base: { duration: durations.base, ease: easings.outSoft },
  slow: { duration: durations.slow, ease: easings.outExpo },
} satisfies Record<string, Transition>;

export const springs = {
  gentle: { type: "spring", stiffness: 260, damping: 28, mass: 0.9 },
} satisfies Record<string, Transition>;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.base },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: transitions.slow },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
