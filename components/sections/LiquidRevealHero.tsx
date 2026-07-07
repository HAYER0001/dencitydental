"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function LiquidRevealHero() {
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // 3. Physics: Custom heavy organic easing
  const transition = {
    duration: 1.8,
    ease: [0.6, 0.05, -0.01, 0.9] as const,
  };

  const initialClipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 85% 94%, 70% 100%, 50% 92%, 30% 100%, 15% 94%, 0% 100%)";
  const finalClipPath = "polygon(0% 0%, 100% 0%, 100% 0%, 85% 0%, 70% 0%, 50% 0%, 30% 0%, 15% 0%, 0% 0%)";

  // 4. SSR Safety Check
  if (!mounted) {
    return (
      <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
        <Image
          src="/images/clinic_lobby.jpg"
          alt="DENCITY Dental Clinic Lobby"
          fill
          priority
          className="object-cover brightness-[0.98] contrast-[1.01]"
        />
        <div className="absolute inset-0 bg-white/70 dark:bg-black/75 backdrop-blur-[1px]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Bottom Layer: Clinic's clean hero image with overlay for readability */}
      <div className="absolute inset-0 bg-background">
        <Image
          src="/images/clinic_lobby.jpg"
          alt="DENCITY Dental Clinic Lobby"
          fill
          priority
          className="object-cover brightness-[0.98] contrast-[1.01]"
        />
        {/* Soft wash overlay matching light/dark theme to protect text legibility */}
        <div className="absolute inset-0 bg-white/70 dark:bg-black/75 backdrop-blur-[1.5px]" />
      </div>

      {/* Top Layer: Abstract organic mask dissolving away */}
      {!reduceMotion && (
        <motion.div
          initial={{ clipPath: initialClipPath }}
          animate={revealed ? { clipPath: finalClipPath } : { clipPath: initialClipPath }}
          transition={transition}
          className="absolute inset-0 bg-[#E6E4E1] dark:bg-[#0F1717] z-10 pointer-events-none"
        />
      )}
    </div>
  );
}
