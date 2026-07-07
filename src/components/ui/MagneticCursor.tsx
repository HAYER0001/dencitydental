"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagneticCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 2. Performance: useMotionValue to directly update x and y properties without React re-renders
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // 1. Physics: useSpring with stiffness: 500 and damping: 28 to decouple from main thread
  const springConfig = { stiffness: 500, damping: 28, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  const scale = useSpring(isHovered ? 1.5 : 1, springConfig);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if device supports hover/mouse (desktop)
    const checkDesktop = () => window.matchMedia("(min-width: 768px)").matches;
    if (!checkDesktop()) return;

    // Hide native cursor on desktop
    document.body.style.cursor = "none";
    const customStyle = document.createElement("style");
    customStyle.innerHTML = `
      @media (min-width: 768px) {
        *, a, button, input, select, textarea, [role="button"] {
          cursor: none !important;
        }
      }
    `;
    document.head.appendChild(customStyle);

    // Track mouse coordinates directly into motion values
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Magnetic snapping locks
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input[type='submit'], input[type='button'], img");

      if (interactive) {
        setIsHovered(true);
        const rect = interactive.getBoundingClientRect();
        // Snap coordinates to center of interactive element
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        mouseX.set(centerX);
        mouseY.set(centerY);
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
    // 3. Visibility: Hidden on mobile (hidden md:block) to prevent interference with touch events
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[100]">
      {/* Outer Circle Ring */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          scale: scale,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className={`w-8 h-8 rounded-full border-2 border-[#0A5C5C] fixed top-0 left-0 transition-colors duration-300 ${
          isHovered ? "bg-[#0A5C5C]/5 border-[#0A5C5C]/40" : "bg-transparent border-[#0A5C5C]"
        }`}
      />
      {/* Inner Center Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovered ? 0 : 1,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="w-1.5 h-1.5 rounded-full bg-[#0A5C5C] fixed top-0 left-0"
      />
    </div>
  );
}
