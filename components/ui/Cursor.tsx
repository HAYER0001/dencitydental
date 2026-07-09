"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function PrecisionCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Directly track mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // 2. Motion: useSpring configuration with stiffness 200, damping 20
  const springConfig = { stiffness: 200, damping: 20 };
  const outerX = useSpring(mouseX, springConfig);
  const outerY = useSpring(mouseY, springConfig);

  // The inner dot tracks immediately for precision feel
  const innerConfig = { stiffness: 500, damping: 28 };
  const innerX = useSpring(mouseX, innerConfig);
  const innerY = useSpring(mouseY, innerConfig);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if pointer hover is supported
    const isDesktop = window.matchMedia("(pointer: fine)").matches;
    if (!isDesktop) return;

    // Hide native cursor
    document.body.style.cursor = "none";
    const customStyle = document.createElement("style");
    customStyle.innerHTML = `
      @media (pointer: fine) {
        *, a, button, input, select, textarea, [role="button"] {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(customStyle);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input[type='submit'], input[type='button'], img");
      if (interactive) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input[type='submit'], input[type='button'], img");
      if (interactive) {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.body.style.cursor = "";
      customStyle.remove();
    };
  }, [mounted, mouseX, mouseY]);

  if (!mounted) return null;

  return (
    // 4. Global: Hidden on mobile (hidden md:block), ignores touch events
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[100]">
      {/* 1. Visuals: Crisp outer ring (white with 1px teal border) */}
      {/* 3. Interaction: Snaps to square (rounded-none) and pulses once on hover */}
      <motion.div
        style={{
          x: outerX,
          y: outerY,
        }}
        transformTemplate={({ x, y }) => `translate3d(${x}, ${y}, 0) translate3d(-50%, -50%, 0)`}
        animate={{
          borderRadius: isHovered ? "4px" : "9999px",
          scale: isHovered ? [1, 1.28, 1.12] : 1,
        }}
        transition={{
          borderRadius: { duration: 0.2, ease: "easeInOut" },
          scale: isHovered 
            ? { times: [0, 0.4, 1], duration: 0.45, ease: "easeOut" } 
            : { duration: 0.25, ease: "easeOut" },
        }}
        className="absolute w-8 h-8 bg-white/30 border border-[#0A5C5C] shadow-soft z-0"
      />

      {/* 1. Visuals: Tiny solid Clinic Teal (#0A5C5C) dot in center */}
      <motion.div
        style={{
          x: innerX,
          y: innerY,
        }}
        transformTemplate={({ x, y }) => `translate3d(${x}, ${y}, 0) translate3d(-50%, -50%, 0)`}
        className="absolute w-1.5 h-1.5 bg-[#0A5C5C] rounded-full z-10"
      />
    </div>
  );
}
