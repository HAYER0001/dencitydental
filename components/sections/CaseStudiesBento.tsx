"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import Container from "@/components/layout/Container";
import { useAntiGravity } from "@/lib/useAntiGravity";

export type CaseStudy = {
  id: string;
  title: string;
  treatment: string;
  description: string;
  beforeLabel: string;
  afterLabel: string;
  colSpanClass: string;
  animationVariant: any;
};

function CaseCard({
  study,
  index,
  reduceMotion,
}: {
  study: CaseStudy;
  index: number;
  reduceMotion: boolean;
}) {
  // Each card floats on its own desynced spring so the grid breathes organically
  // rather than drifting in lockstep. Alternating amplitude adds to the effect.
  const floatY = useAntiGravity({
    amplitude: index % 2 === 0 ? 10 : 7,
    stiffness: 20,
    damping: 12,
    mass: 1.5,
    delay: index * 0.5,
    enabled: !reduceMotion,
  });

  return (
    <motion.article
      variants={reduceMotion ? undefined : study.animationVariant}
      style={{ y: floatY }}
      className={`group relative overflow-hidden rounded-none border border-[#0F1717]/5 bg-white shadow-none flex flex-col justify-between ${study.colSpanClass}`}
    >
      {/* Before/After Split Preview */}
      <div className="absolute inset-0 z-0 flex w-full h-full overflow-hidden">
        {/* Left Side: Before (Grayscale & overlay) */}
        <div className="relative w-1/2 h-full overflow-hidden bg-zinc-800">
          <Image
            src="/images/bright_smile.jpg"
            alt={`${study.title} Before`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover grayscale brightness-50 contrast-125 object-center pointer-events-none"
          />
          <div className="absolute top-4 left-4 z-10 rounded bg-[#0F1717]/70 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">
            Before
          </div>
        </div>

        {/* Vertical Divider line */}
        <div className="w-0.5 bg-white/20 h-full z-10 relative pointer-events-none" />

        {/* Right Side: After (Vibrant, full color) */}
        <div className="relative w-1/2 h-full overflow-hidden bg-zinc-700">
          <Image
            src="/images/bright_smile.jpg"
            alt={`${study.title} After`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center pointer-events-none"
          />
          <div className="absolute top-4 right-4 z-10 rounded bg-[#0A5C5C]/80 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">
            After
          </div>
        </div>
      </div>

      {/* 3. Aesthetic: Glass-morphism Overlay on Hover */}
      <div className="absolute inset-0 z-10 bg-[#0F1717]/35 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/90">
          {study.treatment}
        </span>
        <h3 className="text-base font-bold text-white mt-1.5 flex items-center gap-1.5">
          {study.title} <ArrowUpRight className="h-4 w-4 shrink-0 text-[#7fb8b8]" />
        </h3>
        <p className="text-xs text-white/70 mt-2 leading-relaxed max-w-md">
          {study.description}
        </p>
        <div className="mt-4 flex gap-4 text-[0.65rem] font-medium text-white/50 border-t border-white/10 pt-3">
          <span><strong>From:</strong> {study.beforeLabel}</span>
          <span><strong>To:</strong> {study.afterLabel}</span>
        </div>
      </div>

      {/* Static overlay shown when NOT hovered (shows simple title card bottom bar) */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-5 z-10 group-hover:opacity-0 transition-opacity duration-300 flex items-end justify-between pointer-events-none">
        <div>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[#7fb8b8]">
            {study.treatment}
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">{study.title}</h4>
        </div>
        <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-white">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </motion.article>
  );
}

export default function CaseStudiesBento() {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Trigger when 20% of section enters viewport
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();

  // Fly-in variants from different directions
  const flyLeft = {
    hidden: { opacity: 0, x: -70 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 90, damping: 16 } },
  };

  const flyRight = {
    hidden: { opacity: 0, x: 70 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 90, damping: 16 } },
  };

  // Reveals on the y-axis are avoided here: the permanent anti-gravity float owns `y`,
  // so this card emerges on scale instead to keep the two motions from fighting.
  const flyBottom = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 90, damping: 16 } },
  };

  const caseStudies: CaseStudy[] = [
    {
      id: "cs1",
      title: "Full Arch Restructuring",
      treatment: "Dental Implants",
      description: "Complete lower jaw restoration utilizing 3D-guided surgery.",
      beforeLabel: "Generalized Loss",
      afterLabel: "Functional Biocompatibility",
      colSpanClass: "lg:col-span-2 lg:row-span-2 h-[420px] lg:h-full",
      animationVariant: flyLeft,
    },
    {
      id: "cs2",
      title: "Cosmetic Realignment",
      treatment: "Smile Makeover",
      description: "Porcelain veneers custom-crafted to match natural tooth translucency.",
      beforeLabel: "Asymmetry & Discoloration",
      afterLabel: "Symmetrical Brighter Aesthetic",
      colSpanClass: "lg:col-span-2 h-[200px] lg:h-[220px]",
      animationVariant: flyRight,
    },
    {
      id: "cs3",
      title: "Bite Correction Journey",
      treatment: "Orthodontics",
      description: "Discreet orthodontic aligner therapy completed over 14 months.",
      beforeLabel: "Crowded Lower Incisors",
      afterLabel: "Perfect Direct Arch alignment",
      colSpanClass: "lg:col-span-1 h-[200px] lg:h-[220px]",
      animationVariant: flyBottom,
    },
    {
      id: "cs4",
      title: "Enamel Restoration",
      treatment: "Preventive & Cosmetic",
      description: "Air-flow guided biofilm therapy paired with active enamel remineralization.",
      beforeLabel: "Plaque & Minor Stains",
      afterLabel: "Clean Radiant Surface Protection",
      colSpanClass: "lg:col-span-1 h-[200px] lg:h-[220px]",
      animationVariant: flyBottom,
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);

  if (!mounted) {
    return (
      <section
        aria-labelledby="casestudies-section-title"
        className="py-section-sm bg-background overflow-hidden relative flex flex-col justify-center border-b border-[#0F1717]/5"
      >
        <Container>
          <div className="max-w-2xl mb-12">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#0A5C5C]">
              Case Studies
            </p>
            <h2 id="casestudies-section-title" className="mt-3 text-3xl font-bold tracking-tight text-[#0F1717]">
              Patient Transformations
            </h2>
            <p className="mt-4 text-sm text-[#0F1717]/70 leading-relaxed">
              Witness the clinical outcomes of our digital treatment planning and precision workflows.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[220px]">
            {caseStudies.map((study) => (
              <article
                key={study.id}
                className={`group relative overflow-hidden rounded-none border border-[#0F1717]/5 bg-white shadow-none flex flex-col justify-between ${study.colSpanClass}`}
              >
                <div className="absolute inset-0 z-0 flex w-full h-full overflow-hidden">
                  <div className="relative w-1/2 h-full overflow-hidden bg-zinc-800">
                    <Image
                      src="/images/bright_smile.jpg"
                      alt={`${study.title} Before`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover grayscale brightness-50 contrast-125 object-center pointer-events-none"
                    />
                    <div className="absolute top-4 left-4 z-10 rounded bg-[#0F1717]/70 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">
                      Before
                    </div>
                  </div>
                  <div className="w-0.5 bg-white/20 h-full z-10 relative pointer-events-none" />
                  <div className="relative w-1/2 h-full overflow-hidden bg-zinc-700">
                    <Image
                      src="/images/bright_smile.jpg"
                      alt={`${study.title} After`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center pointer-events-none"
                    />
                    <div className="absolute top-4 right-4 z-10 rounded bg-[#0A5C5C]/80 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-white">
                      After
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-5 z-10 flex items-end justify-between pointer-events-none">
                  <div>
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[#7fb8b8]">
                      {study.treatment}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{study.title}</h4>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  // Stagger container animation
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="casestudies-section-title"
      className="py-section-sm bg-background overflow-hidden relative flex flex-col justify-center border-b border-[#0F1717]/5"
    >
      <Container>
        <div className="max-w-2xl mb-12">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#0A5C5C]">
            Case Studies
          </p>
          <h2 id="casestudies-section-title" className="mt-3 text-3xl font-bold tracking-tight text-[#0F1717]">
            Patient Transformations
          </h2>
          <p className="mt-4 text-sm text-[#0F1717]/70 leading-relaxed">
            Witness the clinical outcomes of our digital treatment planning and precision workflows.
          </p>
        </div>

        {/* 4. Responsive: Desktop (4 columns), Tablet (2 columns), Mobile (1 column) */}
        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? "visible" : "hidden"}
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[220px]"
        >
          {caseStudies.map((study, index) => (
            <CaseCard
              key={study.id}
              study={study}
              index={index}
              reduceMotion={!!reduceMotion}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
