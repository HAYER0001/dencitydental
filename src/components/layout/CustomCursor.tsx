"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/** Elements that should nudge the cursor a touch larger for affordance. */
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary';

/**
 * A single, minimalist circle that trails the pointer on a soft spring and
 * inverts against whatever is beneath it via `mix-blend-difference`.
 *
 * It only engages on precise pointers and when motion is allowed; otherwise it
 * renders nothing and the native cursor is left untouched. The native cursor is
 * hidden from `globals.css` (scoped to `html.custom-cursor-active`) so that if
 * this component never mounts — no JS, touch device, reduced motion — the real
 * cursor still shows. Graceful by construction.
 */
export default function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Buttery trailing spring — a slight, deliberate lag behind the pointer.
  const spring = { stiffness: 260, damping: 28, mass: 0.7 } as const;
  const x = useSpring(mouseX, spring);
  const y = useSpring(mouseY, spring);

  useEffect(() => {
    if (reduceMotion) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor-active");
    setActive(true);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.(INTERACTIVE)) setHovering(true);
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.(INTERACTIVE)) setHovering(false);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      root.classList.remove("custom-cursor-active");
      setActive(false);
    };
  }, [reduceMotion, mouseX, mouseY]);

  if (!active) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-5 w-5 rounded-full bg-white mix-blend-difference will-change-transform"
      style={{ x, y }}
      transformTemplate={({ x, y }) => `translate3d(${x}, ${y}, 0) translate(-50%, -50%)`}
      animate={{ scale: hovering ? 1.9 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.6 }}
    />
  );
}
