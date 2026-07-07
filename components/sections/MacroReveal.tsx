"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

import Container from "@/components/layout/Container";

export default function MacroReveal() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Mouse position normalized motion values
  const mouseX = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // 2. Animation: On-Scroll Lens Reveal (maximum focus at center)
  const blurVal = useTransform(scrollYProgress, [0, 0.45, 0.6, 1], ["20px", "0px", "0px", "12px"]);
  const scaleVal = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.02, 0.95]);
  const opacityVal = useTransform(scrollYProgress, [0, 0.35, 1], [0.5, 1.0, 0.7]);

  // 3. Lighting: Specular highlight horizontal offset tracking
  const highlightX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], ["-120%", "120%"]),
    { stiffness: 60, damping: 18 }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined") {
      const rect = e.currentTarget.getBoundingClientRect();
      // Normalize coordinate between -0.5 and 0.5 relative to component width
      const x = ((e.clientX - rect.left) / rect.width) - 0.5;
      mouseX.set(x);
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      aria-labelledby="macro-section-title"
      className="relative min-h-[140vh] bg-black w-full flex flex-col justify-center overflow-hidden py-24"
      style={{ perspective: "1000px" }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full">
          
          {/* Left Side: Medical Copy */}
          <div className="space-y-6 text-left">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#7fb8b8]">
              Clinical Precision
            </p>
            <h2 id="macro-section-title" className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Titanium Micro-Structures
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400 max-w-md">
              Our implant fixtures leverage laser-microtextured collar structures. This biocompatible design encourages cellular adhesion, preserving marginal bone levels and optimizing soft-tissue stability over time.
            </p>
            <div className="pt-4 flex flex-col gap-4 text-xs font-semibold text-[#7fb8b8] uppercase tracking-wider list-none pl-0 border-t border-zinc-800">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7fb8b8]" /> Grade-5 Bio-Compatible Titanium
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7fb8b8]" /> Laser-LOK Surface Topography
              </span>
            </div>
          </div>

          {/* Right Side: Lens Reveal Viewport */}
          <div className="flex justify-center items-center">
            {/* Viewport container */}
            <motion.div
              style={{
                scale: mounted && !reduceMotion ? scaleVal : 1,
                opacity: mounted && !reduceMotion ? opacityVal : 1,
                filter: mounted && !reduceMotion ? `blur(${blurVal})` : "blur(0px)",
              }}
              className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-[24px] overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 will-change-[transform,opacity,filter]"
            >
              {/* Implant Asset */}
              <Image
                src="/images/dental_implant.jpg"
                alt="Extreme macro shot of titanium implant"
                fill
                priority
                sizes="(max-width: 768px) 300px, 380px"
                className="object-cover pointer-events-none select-none contrast-105 brightness-95"
              />

              {/* 3. Lighting: Specular Gloss Line moving with mouse */}
              <motion.div
                style={{ x: mounted && !reduceMotion ? highlightX : "-120%" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none z-10 mix-blend-overlay will-change-transform"
              />

              {/* Viewport overlay indicator */}
              <div className="absolute bottom-4 left-4 z-20 rounded bg-black/60 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-widest text-zinc-400 border border-zinc-800/40 backdrop-blur-[2px]">
                Macro Focus
              </div>
            </motion.div>
          </div>

        </Container>
      </div>
    </section>
  );
}
