"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function HeroReveal() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Guard client-side dependencies cleanly to preserve absolute SSR safety
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);

  // 3. Interaction: useScroll progress mapped from 0 to 1 of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress to translateX values of the text labels
  const leftTextX = useTransform(scrollYProgress, [0, 0.8], ["0%", "-120%"]);
  const rightTextX = useTransform(scrollYProgress, [0, 0.8], ["0%", "120%"]);

  // Map scroll progress to the scale, width, height, and border radius of the background image
  const imageScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.15]);
  const imageWidth = useTransform(scrollYProgress, [0, 0.8], ["30vw", "100vw"]);
  const imageHeight = useTransform(scrollYProgress, [0, 0.8], ["40vh", "100vh"]);
  const imageBorderRadius = useTransform(scrollYProgress, [0, 0.8], ["24px", "0px"]);
  const overlayOpacity = useTransform(scrollYProgress, [0.4, 0.8], [0, 0.35]);

  return (
    <div 
      ref={containerRef} 
      className="relative h-[200vh] bg-background w-full"
    >
      {/* Sticky container that keeps the view locked during scroll-reveal */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Background Image Container */}
        <motion.div
          style={{
            width: mounted ? (reduceMotion ? "100vw" : imageWidth) : "30vw",
            height: mounted ? (reduceMotion ? "100vh" : imageHeight) : "40vh",
            borderRadius: mounted ? (reduceMotion ? "0px" : imageBorderRadius) : "24px",
            scale: mounted ? (reduceMotion ? 1 : imageScale) : 0.8,
          }}
          className="absolute z-0 flex items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-black"
        >
          {/* Black & White Mountain Landscape Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center grayscale contrast-125 brightness-90"
            style={{ backgroundImage: "url('/images/mountain_landscape.jpg')" }}
            role="img"
            aria-label="Minimalist black and white mountain peaks"
          />
          {/* Soft dark overlay for text contrast */}
          <motion.div 
            style={{ opacity: mounted ? (reduceMotion ? 0.3 : overlayOpacity) : 0 }}
            className="absolute inset-0 bg-black pointer-events-none"
          />
        </motion.div>

        {/* 1. Layout: Two large, bold text labels flanking the center */}
        <div className="absolute inset-0 z-10 flex items-center justify-between w-full max-w-7xl mx-auto px-6 md:px-12 pointer-events-none">
          
          {/* Left Text Label */}
          <motion.h2
            style={{ x: mounted ? (reduceMotion ? "0%" : leftTextX) : "0%" }}
            className="text-[12vw] font-black tracking-tighter text-foreground uppercase select-none font-sans leading-none drop-shadow-sm"
          >
            HEXTS
          </motion.h2>

          {/* Right Text Label */}
          <motion.h2
            style={{ x: mounted ? (reduceMotion ? "0%" : rightTextX) : "0%" }}
            className="text-[12vw] font-black tracking-tighter text-foreground uppercase select-none font-sans leading-none drop-shadow-sm"
          >
            LORETS
          </motion.h2>
        </div>

        {/* Dynamic center indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-foreground/45 z-10 pointer-events-none">
          Scroll to reveal landscape
        </div>
      </div>
    </div>
  );
}
