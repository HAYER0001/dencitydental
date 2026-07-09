"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Cinematic route transition — a calm, editorial "fade in from black".
 *
 * This lives in `template.tsx`, not `layout.tsx`, because Next.js gives the
 * template a fresh key on every navigation, so this entry animation replays on
 * each route change instead of mounting only once. It is purely presentational:
 * it wraps `children` and touches no page content, routing, or data fetching.
 *
 * On every navigation the incoming page settles from scale 1.02 → 1.00 while an
 * absolute-black curtain lifts (opacity 1 → 0) to reveal it. Exactly 0.6s on a
 * bespoke decelerating cubic-bezier so the cut feels deliberate and luxurious,
 * like a high-end editorial video transition.
 */
const DURATION = 0.6;
const EASE = [0.22, 1, 0.36, 1] as const;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  // Respect reduced-motion: no push-in, no black flash — just render the page.
  if (reduceMotion) {
    return <div className="flex flex-1 flex-col">{children}</div>;
  }

  return (
    <motion.div
      initial={{ scale: 1.02 }}
      animate={{ scale: 1 }}
      transition={{ duration: DURATION, ease: EASE }}
      className="relative flex flex-1 flex-col"
    >
      {children}

      {/* The absolute-black stage the page fades in from. It sits above the page,
          lifts to fully transparent, then stays inert (pointer-events-none). Scoped
          to the main content region, so the persistent chrome (navbar, footer,
          dock) is never covered. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: DURATION, ease: EASE }}
        className="pointer-events-none absolute inset-0 z-[100] bg-black"
      />
    </motion.div>
  );
}
