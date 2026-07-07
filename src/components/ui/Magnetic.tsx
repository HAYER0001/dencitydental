"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useSpring, useMotionValue, useReducedMotion } from "framer-motion";

interface MagneticProps {
  children: React.ReactElement;
  range?: number;
  strength?: number;
}

export default function Magnetic({ children, range = 70, strength = 0.25 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end inertia feel
  const springConfig = { stiffness: 120, damping: 15, mass: 0.6 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (reduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      // Within proximity threshold, pull button toward mouse coordinates
      if (distance < range) {
        const pullX = (e.clientX - centerX) * strength;
        const pullY = (e.clientY - centerY) * strength;
        mouseX.set(pullX);
        mouseY.set(pullY);
      } else {
        // Reset coordinate values when cursor moves out of range
        mouseX.set(0);
        mouseY.set(0);
      }
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const node = ref.current;
    window.addEventListener("mousemove", handleMouseMove);
    node?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      node?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [reduceMotion, range, strength, mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      style={{ x: reduceMotion ? 0 : x, y: reduceMotion ? 0 : y }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
