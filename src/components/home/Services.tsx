"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useMotionTemplate, useTransform, animate, type Variants } from "framer-motion";

import Container from "@/components/layout/Container";
import ScrambleText from "@/components/ui/ScrambleText";
import { useAntiGravity } from "@/lib/useAntiGravity";
import Magnetic from "@/components/ui/Magnetic";

export type Service = {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  benefits: string[];
  icon: React.ReactNode;
};

const services: Service[] = [
  {
    id: "general",
    title: "General Dentistry",
    shortDesc: "Routine care to keep your teeth and gums healthy.",
    longDesc: "Comprehensive exams, professional cleanings, and modern composite fillings designed to prevent issues and maintain your natural teeth for life.",
    benefits: [
      "Digital diagnostics with minimal radiation",
      "Guided biofilm therapy for gentle cleanings",
      "Mercury-free composite restorations"
    ],
    icon: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    )
  },
  {
    id: "cosmetic",
    title: "Cosmetic Dentistry",
    shortDesc: "Enhance the natural beauty of your smile.",
    longDesc: "Custom aesthetic treatments including porcelain veneers, composite bonding, and professional whitening to create a bright, balanced smile that feels uniquely yours.",
    benefits: [
      "Digital smile design previews",
      "Ultra-thin, conservative porcelain veneers",
      "In-office and take-home whitening options"
    ],
    icon: (
      <>
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.3-6.3l-.7.7M6.7 17.3l-.7.7m12.6 0l-.7-.7M6.7 6.7l-.7-.7" />
        <circle cx="12" cy="12" r="4" />
      </>
    )
  },
  {
    id: "ortho",
    title: "Orthodontics",
    shortDesc: "Straighten teeth and align your bite.",
    longDesc: "Modern orthodontic treatments featuring clear aligners and discreet braces to align your teeth, improve bite function, and enhance overall oral health.",
    benefits: [
      "3D scans instead of messy impressions",
      "Custom-crafted clear aligners",
      "Solutions for both teens and adults"
    ],
    icon: (
      <>
        <path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5z" />
        <path d="M12 3v18" />
        <path d="M3 12h18" />
      </>
    )
  },
  {
    id: "implants",
    title: "Dental Implants",
    shortDesc: "Permanent, natural-looking tooth replacements.",
    longDesc: "State-of-the-art dental implants that restore full function and aesthetics by replacing missing teeth from root to crown with premium biocompatible materials.",
    benefits: [
      "3D-guided surgical planning for accuracy",
      "Implants that look, feel, and function like real teeth",
      "Prevents jawbone loss and facial structure changes"
    ],
    icon: (
      <>
        <path d="M12 2v8" />
        <path d="M9 10h6" />
        <path d="M7 14c0-2.8 2.2-5 5-5s5 2.2 5 5v4H7v-4z" />
        <path d="M10 18v3" />
        <path d="M14 18v3" />
      </>
    )
  },
  {
    id: "pediatric",
    title: "Pediatric Dentistry",
    shortDesc: "Gentle, positive dental care for children.",
    longDesc: "Specialized care for kids in a warm, welcoming environment. We focus on building positive dental habits and monitoring early development with extra patience.",
    benefits: [
      "Child-friendly language and explanation",
      "Preventive sealants and fluoride treatments",
      "Fun, educational visits that eliminate fear"
    ],
    icon: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </>
    )
  },
  {
    id: "emergency",
    title: "Emergency Care",
    shortDesc: "Immediate relief for urgent dental problems.",
    longDesc: "Urgent dental treatment for severe toothaches, chipped or knocked-out teeth, broken crowns, or swelling. We prioritize same-day appointments to relieve your pain.",
    benefits: [
      "Priority scheduling for urgent cases",
      "Immediate pain relief and stabilization",
      "Advanced sedation options for comfort"
    ],
    icon: (
      <>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </>
    )
  }
];

interface ServiceCardProps {
  service: Service;
  index: number;
  isExpanded: boolean;
  onClick: () => void;
  cardVariants: Variants;
  pathVariants: Variants;
  reduceMotion: boolean;
}

function ServiceCard({ service, index, isExpanded, onClick, cardVariants, pathVariants, reduceMotion }: ServiceCardProps) {
  const defaultWidth = 300;
  const defaultHeight = 200;

  const mouseX = useMotionValue(defaultWidth / 2);
  const mouseY = useMotionValue(defaultHeight / 2);

  const attractX = useTransform(mouseX, [0, defaultWidth], [-5, 5]);
  const attractY = useTransform(mouseY, [0, defaultHeight], [-5, 5]);

  // Permanent anti-gravity float, desynced per card. It pauses (eases to rest)
  // while the card is expanded so the open panel — and its "Book" action — holds
  // perfectly still for reading and clicking.
  const floatY = useAntiGravity({
    amplitude: 9,
    stiffness: 20,
    damping: 12,
    mass: 1.5,
    delay: index * 0.35,
    enabled: !isExpanded,
  });

  // Float and mouse-attract share the y-axis, so compose them into a single value.
  const composedY = useTransform(
    [floatY, attractY] as const,
    ([f, a]: number[]) => f + a
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    animate(mouseX, defaultWidth / 2, { type: "spring", stiffness: 120, damping: 20 });
    animate(mouseY, defaultHeight / 2, { type: "spring", stiffness: 120, damping: 20 });
  };

  const spotlightBg = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(10, 92, 92, 0.08), transparent 80%)`;

  const layoutTransition = {
    type: "spring",
    stiffness: 120,
    damping: 20,
    mass: 0.8
  } as const;

  return (
    <>
      {/* 1. Effect: SVG clip-path mask to create an organic, liquid-like reveal */}
      {!reduceMotion && (
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <clipPath id={`clip-${service.id}`} clipPathUnits="objectBoundingBox">
              <motion.path
                variants={pathVariants}
              />
            </clipPath>
          </defs>
        </svg>
      )}

      <motion.article
        variants={cardVariants}
        layout={reduceMotion ? undefined : true}
        transition={reduceMotion ? { duration: 0 } : layoutTransition}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`group relative overflow-hidden flex h-full cursor-pointer flex-col rounded-card border bg-background p-7 shadow-soft transition-[box-shadow,border-color] duration-[var(--duration-base)] hover:shadow-card dark:border-white/10 ${
          isExpanded
            ? "border-clinic-teal/40 ring-1 ring-clinic-teal/40 md:col-span-2 lg:col-span-2"
            : "border-deep-charcoal/5 hover:border-clinic-teal/25"
        }`}
        style={{
          x: reduceMotion ? 0 : attractX,
          y: reduceMotion ? 0 : composedY,
          clipPath: reduceMotion ? undefined : `url(#clip-${service.id})`,
          contentVisibility: "auto"
        }}
      >
        {/* Soft interactive spotlight layer */}
        <motion.div
          style={{ background: spotlightBg }}
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 z-0"
        />

        <div className="flex items-center gap-4 relative z-10">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-pill transition-colors duration-[var(--duration-base)] ${
              isExpanded
                ? "bg-clinic-teal text-white"
                : "bg-surface text-clinic-teal group-hover:bg-clinic-teal/10 dark:text-clinic-teal-soft"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {service.icon}
            </svg>
          </div>
          <div>
            <h3 className="text-heading-3">{service.title}</h3>
            {!isExpanded && (
              <p className="mt-1 text-body-sm text-muted">{service.shortDesc}</p>
            )}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.3, ease: "easeOut" }
              }
              className="mt-6 flex flex-1 flex-col border-t border-deep-charcoal/5 pt-6 dark:border-white/10 relative z-10"
            >
              <p className="text-body-sm text-muted">{service.longDesc}</p>
              
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Key Benefits
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-body-sm">
                      <svg
                        viewBox="0 0 24 24"
                        className="mt-0.5 h-4 w-4 shrink-0 text-clinic-teal dark:text-clinic-teal-soft"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-foreground/80">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-8">
                <Magnetic className="block w-full" strength={0.12} glow>
                  <Link
                    href={`/book?treatment=${service.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex w-full items-center justify-center rounded-pill bg-clinic-teal px-5 py-3 font-semibold text-white shadow-soft transition-colors duration-[var(--duration-fast)] hover:bg-clinic-teal/90 active:bg-clinic-teal/90"
                  >
                    Book this Treatment
                  </Link>
                </Magnetic>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isExpanded && (
          <div className="mt-auto pt-6 flex items-center justify-end text-body-sm font-medium text-clinic-teal dark:text-clinic-teal-soft relative z-10">
            <span>Learn more</span>
            <svg
              viewBox="0 0 24 24"
              className="ml-1.5 h-4 w-4 transition-transform duration-[var(--duration-base)] group-hover:translate-x-1 group-active:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        )}
      </motion.article>
    </>
  );
}

export default function Services() {
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCardClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 2. Animation: staggerChildren: 0.1 stagger reveal parent controls
  const parentVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // 2. Animation: Emerge with a blur-out (blur(10px) to blur(0px)) and gentle scale.
  // The reveal stays off the y-axis — that axis belongs to the permanent float — so
  // the two never fight for the same transform.
  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.96,
      filter: "blur(10px)"
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 90, damping: 14 }
    },
  };

  // 1. Effect: Organic path morphing configurations
  const pathVariants: Variants = {
    hidden: {
      d: "M 0,0 L 1,0 L 1,0 Q 0.5,0 0,0 Z"
    },
    visible: {
      d: "M 0,0 L 1,0 L 1,1 Q 0.5,1 0,1 Z",
      transition: { duration: 1.4, ease: [0.6, 0.05, -0.01, 0.9] }
    }
  };

  if (!mounted) {
    return (
      <section aria-labelledby="services-heading" className="py-section">
        <Container>
          <div className="max-w-2xl">
            <p className="text-eyebrow text-clinic-teal dark:text-clinic-teal-soft">Treatments</p>
            <h2 id="services-heading" className="text-heading-1 mt-3">
              Our Dental Services
            </h2>
            <p className="mt-4 text-body-lg text-muted">
              Click on any service to explore detailed treatments, benefits, and appointment options.
            </p>
          </div>
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.id}
                className="flex h-full flex-col rounded-card border bg-background p-7 border-deep-charcoal/5 dark:border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-surface text-clinic-teal dark:text-clinic-teal-soft">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7">
                      {service.icon}
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-heading-3">{service.title}</h3>
                    <p className="mt-1 text-body-sm text-muted">{service.shortDesc}</p>
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
    <section aria-labelledby="services-heading" className="py-section">
      <Container>
        <div className="max-w-2xl">
          <p className="text-eyebrow text-clinic-teal dark:text-clinic-teal-soft">Treatments</p>
          <h2 id="services-heading" className="mt-3 text-heading-1">
            <ScrambleText text="Our Dental Services" delay={150} />
          </h2>
          <p className="mt-4 text-body-lg text-muted">
            Click on any service to explore detailed treatments, benefits, and appointment options.
          </p>
        </div>

        {/* 3. Logic: whileInView with viewport once: true and amount: 0.3 */}
        <motion.div
          layout={reduceMotion ? undefined : "position"}
          variants={parentVariants}
          initial={reduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              isExpanded={expandedId === service.id}
              onClick={() => handleCardClick(service.id)}
              cardVariants={cardVariants}
              pathVariants={pathVariants}
              reduceMotion={!!reduceMotion}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
