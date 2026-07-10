"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import Container from "@/components/layout/Container";

interface PixelAssembleTextProps {
  text?: string;
}

interface Pixel {
  id: string;
  x: number;
  y: number;
  rx: number;
  ry: number;
}

export default function PixelAssembleText({ text = "Clinical Excellence" }: PixelAssembleTextProps) {
  const [mounted, setMounted] = useState(false);
  const [pixels, setPixels] = useState<Pixel[]>([]);
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(0.85);
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // 4. SSR Safety Check
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Set up low-resolution offscreen canvas to rasterize heading text into coordinate pixels
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Rasterize at 9px tall font to keep pixel count optimal and high-performance
    ctx.font = "bold 9px monospace";
    const textWidth = Math.ceil(ctx.measureText(text).width);
    canvas.width = textWidth + 2;
    canvas.height = 11;

    ctx.fillStyle = "black";
    ctx.font = "bold 9px monospace";
    ctx.textBaseline = "top";
    ctx.fillText(text, 1, 1);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelList: Pixel[] = [];

    // Map filled pixel blocks
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const alpha = imgData.data[(y * canvas.width + x) * 4 + 3];
        if (alpha > 120) {
          // 3. Logic: Generate random scattered start coordinates (within -400px to 400px window)
          const rx = (Math.random() - 0.5) * 600;
          const ry = (Math.random() - 0.5) * 400;

          pixelList.push({
            id: `p-${x}-${y}`,
            x: x * 16, // final x coordinate spaced at 16px grid intervals
            y: y * 16, // final y coordinate spaced at 16px grid intervals
            rx,
            ry,
          });
        }
      }
    }

    setGridSize({
      width: canvas.width * 16,
      height: canvas.height * 16,
    });
    setPixels(pixelList);
  }, [text, mounted]);

  // Responsive scale: shrink the fixed-px pixel grid so it always fits the
  // viewport width (with side padding) — prevents horizontal overflow/clipping
  // on mobile while capping at 0.85 on wide screens. Recomputes on resize.
  useEffect(() => {
    if (!mounted || !gridSize.width) return;

    const computeScale = () => {
      const available = Math.min(window.innerWidth * 0.9, 1024);
      setScale(Math.min(0.85, available / gridSize.width));
    };

    computeScale();
    window.addEventListener("resize", computeScale);
    return () => window.removeEventListener("resize", computeScale);
  }, [mounted, gridSize.width]);

  // 4. Stagger container configuration (staggerChildren: 0.006 for fast matrix fluid reveal)
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.008,
      },
    },
  };

  const pixelVariants = {
    hidden: (custom: { rx: number; ry: number }) => ({
      x: custom.rx,
      y: custom.ry,
      opacity: 0,
    }),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 14,
      },
    },
  };

  if (!mounted) {
    return (
      <section className="py-section-sm bg-background border-b border-[#0F1717]/5" aria-labelledby="pixel-section-title">
        <Container className="flex flex-col items-center">
          <h2
            id="pixel-section-title"
            className="font-bold tracking-tight text-center text-[#0F1717] text-[clamp(1.75rem,7vw,3rem)]"
          >
            {text}
          </h2>
        </Container>
      </section>
    );
  }

  return (
    <section 
      ref={containerRef}
      aria-labelledby="pixel-section-title"
      className="py-section-sm bg-[#F9F9F9] border-b border-[#0F1717]/5 overflow-hidden flex flex-col justify-center min-h-[450px]"
    >
      <Container className="flex flex-col items-center justify-center relative">
        <div className="max-w-2xl text-center mb-16">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#0A5C5C]">
            Digital Synthesis
          </p>
          <h2 id="pixel-section-title" className="sr-only">
            {text}
          </h2>
        </div>

        {/* Scaled responsive wrapper to center pixels across screen dimensions.
            Scale is derived from viewport width so the grid never overflows. */}
        <div
          className="relative select-none pointer-events-none"
          style={{
            width: gridSize.width,
            height: gridSize.height,
            transform: `scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          {reduceMotion ? (
            // Accessibility fallback
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-[#0F1717] tracking-[0.1em] uppercase font-mono text-[clamp(1.5rem,6vw,3rem)] break-words">
                {text}
              </span>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="absolute inset-0"
            >
              {pixels.map((pixel) => (
                <motion.div
                  key={pixel.id}
                  custom={{ rx: pixel.rx, ry: pixel.ry }}
                  variants={pixelVariants}
                  // 1. Concept: 14x14px black square block representation
                  className="absolute w-[14px] h-[14px] bg-[#0F1717] rounded-none"
                  style={{
                    left: pixel.x,
                    top: pixel.y,
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}
