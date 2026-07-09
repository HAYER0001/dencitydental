"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

import Container from "@/components/layout/Container";

export default function DentalAnatomy() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Guard client-side dependencies cleanly to preserve absolute SSR safety
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scroll-linked layer separations (Enamel moves up/left, Dentin stays, Pulp moves down/right)
  const enamelY = useTransform(scrollYProgress, [0.1, 0.8], [0, -65]);
  const enamelX = useTransform(scrollYProgress, [0.1, 0.8], [0, -35]);

  const dentinY = useTransform(scrollYProgress, [0.1, 0.8], [0, 0]);
  const dentinX = useTransform(scrollYProgress, [0.1, 0.8], [0, 0]);

  const pulpY = useTransform(scrollYProgress, [0.1, 0.8], [0, 65]);
  const pulpX = useTransform(scrollYProgress, [0.1, 0.8], [0, 35]);

  // Scroll-linked rotation for 3D effect
  const toothRotate = useTransform(scrollYProgress, [0.1, 0.8], [0, 15]);

  // Opacities for the text cards based on scroll progress
  const opacityEnamel = useTransform(scrollYProgress, [0.1, 0.3, 0.5], [0.25, 1, 0.25]);
  const opacityDentin = useTransform(scrollYProgress, [0.35, 0.55, 0.75], [0.25, 1, 0.25]);
  const opacityPulp = useTransform(scrollYProgress, [0.6, 0.8, 1.0], [0.25, 1, 1]);

  return (
    <div 
      ref={containerRef} 
      className="relative h-[250vh] bg-[#F9F9F9] w-full"
    >
      {/* Sticky wrapper locking viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Column: Visual 3D separate-on-scroll tooth layers */}
          <div className="relative flex justify-center items-center">
            <motion.div
              style={{
                rotate: mounted && !reduceMotion ? toothRotate : 0,
              }}
              className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] aspect-square"
            >
              {/* Enamel Layer (Top 33%) */}
              <motion.div
                style={{
                  y: mounted && !reduceMotion ? enamelY : 0,
                  x: mounted && !reduceMotion ? enamelX : 0,
                  clipPath: "polygon(0 0, 100% 0, 100% 33%, 0 33%)",
                }}
                className="absolute inset-0 z-20 will-change-transform"
              >
                <Image
                  src="/images/tooth_anatomy.jpg"
                  alt="Tooth Enamel Layer"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="object-contain filter drop-shadow-none"
                />
              </motion.div>

              {/* Dentin Layer (Middle 33%) */}
              <motion.div
                style={{
                  y: mounted && !reduceMotion ? dentinY : 0,
                  x: mounted && !reduceMotion ? dentinX : 0,
                  clipPath: "polygon(0 33%, 100% 33%, 100% 66%, 0 66%)",
                }}
                className="absolute inset-0 z-10 will-change-transform"
              >
                <Image
                  src="/images/tooth_anatomy.jpg"
                  alt="Tooth Dentin Layer"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="object-contain filter drop-shadow-none"
                />
              </motion.div>

              {/* Pulp & Roots Layer (Bottom 34%) */}
              <motion.div
                style={{
                  y: mounted && !reduceMotion ? pulpY : 0,
                  x: mounted && !reduceMotion ? pulpX : 0,
                  clipPath: "polygon(0 66%, 100% 66%, 100% 100%, 0 100%)",
                }}
                className="absolute inset-0 z-0 will-change-transform"
              >
                <Image
                  src="/images/tooth_anatomy.jpg"
                  alt="Tooth Pulp Layer"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="object-contain filter drop-shadow-none"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Dynamic fading content highlights */}
          <div className="space-y-12">
            <div>
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#0A5C5C]">
                Clinical Precision
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0F1717]">
                Anatomy of a Smile
              </h2>
            </div>

            <div className="space-y-8 relative">
              {/* Enamel Card */}
              <motion.div
                style={{ opacity: mounted && !reduceMotion ? opacityEnamel : 1 }}
                className="border-l-2 border-[#0A5C5C] pl-6 transition-all duration-300"
              >
                <h3 className="text-sm font-bold text-[#0F1717] uppercase tracking-wider">
                  01. Enamel (Protective Boundary)
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-[#0F1717]/70">
                  The hardest protective layer in the human body. Our preventive checkups and GBT cleanings focus heavily on keeping this shield remineralized and free of acidic decalcification.
                </p>
              </motion.div>

              {/* Dentin Card */}
              <motion.div
                style={{ opacity: mounted && !reduceMotion ? opacityDentin : 1 }}
                className="border-l-2 border-[#0A5C5C]/50 pl-6 transition-all duration-300"
              >
                <h3 className="text-sm font-bold text-[#0F1717] uppercase tracking-wider">
                  02. Dentin (Supporting Structure)
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-[#0F1717]/70">
                  The flexible tissue backing the enamel. When exposed, it causes thermal sensitivity. We use bio-compatible composite materials to seal microscopic tubules and restore structural cohesion.
                </p>
              </motion.div>

              {/* Pulp Card */}
              <motion.div
                style={{ opacity: mounted && !reduceMotion ? opacityPulp : 1 }}
                className="border-l-2 border-[#0A5C5C]/30 pl-6 transition-all duration-300"
              >
                <h3 className="text-sm font-bold text-[#0F1717] uppercase tracking-wider">
                  03. Pulp (Vital Core)
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-[#0F1717]/70">
                  The vital system housing blood vessels and nerves. If compromised, our precision micro-endodontics (root canals) stabilize the tooth, or we replace it using biocompatible implant cores.
                </p>
              </motion.div>
            </div>
          </div>

        </Container>
      </div>
    </div>
  );
}
