"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Shield, Sparkles, Heart, Activity, Target, MessageSquare } from "lucide-react";

import Container from "@/components/layout/Container";

export type AssemblyCard = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  stackedRotation: number;
  stackedZIndex: number;
};

const cards: AssemblyCard[] = [
  {
    id: "c1",
    title: "Safety First",
    description: "Digital low-radiation diagnostics and medical-grade sterilization.",
    icon: <Shield className="h-6 w-6" />,
    stackedRotation: -3,
    stackedZIndex: 30,
  },
  {
    id: "c2",
    title: "Comfort Tech",
    description: "Guided biofilm cleanings, warm neck pillows, and noise-cancelling options.",
    icon: <Sparkles className="h-6 w-6" />,
    stackedRotation: 0,
    stackedZIndex: 25,
  },
  {
    id: "c3",
    title: "Gentle Care",
    description: "Anxiety-free dentistry with unhurried, patient-centered timelines.",
    icon: <Heart className="h-6 w-6" />,
    stackedRotation: 3,
    stackedZIndex: 20,
  },
  {
    id: "c4",
    title: "Precision Surgery",
    description: "3D-guided implant placements ensuring minimal disruption and faster healing.",
    icon: <Activity className="h-6 w-6" />,
    stackedRotation: -1.5,
    stackedZIndex: 15,
  },
  {
    id: "c5",
    title: "Aesthetic Design",
    description: "Custom digital smile designs tailored to your natural facial geometry.",
    icon: <Target className="h-6 w-6" />,
    stackedRotation: 1.5,
    stackedZIndex: 10,
  },
  {
    id: "c6",
    title: "Clear Honesty",
    description: "Opaque-free treatment plans with detailed cost quotes provided upfront.",
    icon: <MessageSquare className="h-6 w-6" />,
    stackedRotation: -4,
    stackedZIndex: 5,
  },
];

export default function InteractiveAssembly() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [isExploded, setIsExploded] = useState(false);

  // 4. SSR Safety Check: Guard client side execution
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Layout & Scroll Un-tangling: Spring transition
  const springTransition = {
    type: "spring",
    stiffness: 100,
    damping: 15,
    mass: 1,
  } as const;

  // Render static grid for SSR to avoid layout shift
  if (!mounted) {
    return (
      <section 
        aria-labelledby="assembly-section-title"
        className="py-20 bg-background overflow-hidden relative flex flex-col justify-center min-h-[750px] border-b border-[#0F1717]/5"
      >
        <Container className="flex flex-col items-center">
          <div className="max-w-2xl text-center mb-16">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#0A5C5C]">
              Our Pillars
            </p>
            <h2 id="assembly-section-title" className="mt-3 text-3xl font-bold tracking-tight text-[#0F1717]">
              Built on Patient Comfort
            </h2>
            <p className="mt-4 text-sm text-[#0F1717]/70 leading-relaxed">
              Scroll down to watch our core clinical values assemble from a compact 3D core into a structured grid.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full min-h-[500px]">
            {cards.map((card) => (
              <article
                key={card.id}
                className="flex flex-col justify-between rounded-[1rem] border border-[#0F1717]/5 bg-[#F9F9F9] p-6 shadow-[0_1px_2px_rgba(15,23,23,0.05),0_4px_12px_rgba(15,23,23,0.06)] h-[220px]"
              >
                <div className="space-y-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A5C5C]/10 text-[#0A5C5C]">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#0F1717]">{card.title}</h3>
                    <p className="mt-2 text-xs text-[#0F1717]/70 leading-relaxed">{card.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section 
      ref={containerRef}
      aria-labelledby="assembly-section-title"
      className="py-20 bg-background overflow-hidden relative flex flex-col justify-center min-h-[750px] border-b border-[#0F1717]/5"
    >
      {/* 1. Layout & Scroll Un-tangling: Intersection Observer via onViewportEnter */}
      <motion.div 
        onViewportEnter={() => setIsExploded(true)}
        viewport={{ once: true, amount: 0.25 }}
        className="w-full flex flex-col items-center"
      >
        <Container className="flex flex-col items-center">
          <div className="max-w-2xl text-center mb-16">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#0A5C5C]">
              Our Pillars
            </p>
            <h2 id="assembly-section-title" className="mt-3 text-3xl font-bold tracking-tight text-[#0F1717]">
              Built on Patient Comfort
            </h2>
            <p className="mt-4 text-sm text-[#0F1717]/70 leading-relaxed">
              Watch our core clinical values assemble from a compact 3D stack into a structured grid as you scroll.
            </p>
          </div>

          {/* 1. Dynamic switch between relative flex center and 3 column grid */}
          <div 
            className={`w-full transition-all duration-500 ${
              isExploded 
                ? "grid grid-cols-1 md:grid-cols-3 gap-8" 
                : "relative flex justify-center items-center h-[350px]"
            }`}
          >
            {cards.map((card) => {
              // Stacked absolute coordinates vs Grid relative coordinates
              const targetRotation = isExploded ? 0 : card.stackedRotation;
              const targetZIndex = isExploded ? 10 : card.stackedZIndex;

              return (
                <motion.article
                  key={card.id}
                  layout={reduceMotion ? undefined : "position"}
                  initial={{
                    rotate: reduceMotion ? 0 : card.stackedRotation,
                    scale: 0.95,
                  }}
                  animate={{
                    rotate: targetRotation,
                    scale: 1,
                    zIndex: targetZIndex,
                  }}
                  // 3. AnimmasterLib Interactive Magnetic Hover Matrix: scale up, translate y, premium easing shadow
                  whileHover={{
                    scale: 1.03,
                    y: -5,
                    boxShadow: "0 20px 40px -15px rgba(15, 23, 23, 0.15), 0 30px 60px -20px rgba(15, 23, 23, 0.1)",
                  }}
                  transition={
                    reduceMotion 
                      ? { duration: 0 } 
                      : {
                          layout: springTransition,
                          rotate: springTransition,
                          scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                          y: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                          boxShadow: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                        }
                  }
                  // 2. Premium Aesthetic & Color Injection: Off-White, Deep Charcoal, slate text
                  className={`flex flex-col justify-between rounded-[1rem] border border-[#0F1717]/5 bg-[#F9F9F9] p-6 shadow-[0_1px_2px_rgba(15,23,23,0.05),0_4px_12px_rgba(15,23,23,0.06)] ${
                    isExploded
                      ? "relative w-full h-[220px]"
                      : "absolute w-[285px] h-[200px]"
                  }`}
                >
                  <div className="space-y-4">
                    {/* 2. Primary Clinic Teal (#0A5C5C) container, 10% opacity fill, primary stroke */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A5C5C]/10 text-[#0A5C5C]">
                      {card.icon}
                    </div>
                    <div>
                      {/* 2. Bold Deep Charcoal title, slate description */}
                      <h3 className="text-sm font-bold text-[#0F1717]">{card.title}</h3>
                      <p className="mt-2 text-xs text-[#0F1717]/70 leading-relaxed">{card.description}</p>
                    </div>
                  </div>

                  {!isExploded && (
                    // 2. Clinic Teal (#0A5C5C) core label
                    <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#0A5C5C] text-right">
                      DENCITY CORE
                    </div>
                  )}
                </motion.article>
              );
            })}
          </div>
        </Container>
      </motion.div>
    </section>
  );
}
