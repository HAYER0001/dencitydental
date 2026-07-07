"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useMotionValue, useMotionTemplate } from "framer-motion";

export interface PricingPackage {
  title: string;
  price: string;
  inclusions: string[];
  cta: string;
  href: string;
}

const pricingPackages: PricingPackage[] = [
  {
    title: "Preventive Care",
    price: "₹15,000",
    inclusions: [
      "Comprehensive Oral Exam",
      "Professional Dental Cleaning",
      "Fluoride Treatment",
      "X-Rays (2 per year)",
      "Oral Hygiene Consultation",
    ],
    cta: "Book Preventive Care",
    href: "/book?treatment=general",
  },
  {
    title: "Smile Makeover",
    price: "₹30,000",
    inclusions: [
      "Cosmetic Consultation",
      "Teeth Whitening Session",
      "Porcelain Veneer (1 unit)",
      "Dental Bonding",
      "Follow-up Adjustments",
    ],
    cta: "Start Smile Makeover",
    href: "/book?treatment=cosmetic",
  },
  {
    title: "Implant Care",
    price: "₹45,000",
    inclusions: [
      "Dental Implant Placement (1 unit)",
      "Abutment and Crown",
      "Post-Surgical Follow-ups",
      "Oral Surgery Consultation",
      "Anesthesia (Local)",
    ],
    cta: "Schedule Implant Care",
    href: "/book?treatment=implants",
  },
];

interface PricingCardProps {
  pkg: PricingPackage;
  cardVariants: any;
  staticCardStyles: string;
}

function PricingCard({ pkg, cardVariants, staticCardStyles }: PricingCardProps) {
  // 2. Lighting: Track mouse position relative to the card to move radial spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const spotlightBg = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(10, 92, 92, 0.08), transparent 80%)`;

  return (
    <motion.article
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      className={`${staticCardStyles} group relative overflow-hidden`}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 30px -10px rgba(15, 23, 23, 0.15), 0 20px 40px -15px rgba(15, 23, 23, 0.12)",
      }}
      whileTap={{
        scale: 1.02,
        boxShadow: "0 10px 30px -10px rgba(15, 23, 23, 0.15), 0 20px 40px -15px rgba(15, 23, 23, 0.12)",
      }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Soft interactive spotlight layer */}
      <motion.div
        style={{ background: spotlightBg }}
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
      />

      <h3 className="text-xl font-semibold text-[#0A5C5C] mb-4 relative z-10">
        {pkg.title}
      </h3>
      
      <p className="text-4xl font-bold text-[#0F1717] mb-6 relative z-10">
        {pkg.price}
      </p>

      <ul className="text-[#0F1717]/80 text-sm leading-relaxed list-none p-0 mb-8 flex-grow space-y-3 border-t border-[#0F1717]/5 pt-6 w-full relative z-10">
        {pkg.inclusions.map((item, i) => (
          <li key={i} className="flex items-center justify-center gap-2">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 text-[#0A5C5C]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <a
        href={pkg.href}
        className="mt-auto inline-flex items-center justify-center w-full bg-[#0A5C5C] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#0A5C5C]/90 transition-colors duration-[var(--duration-fast)] relative z-10"
      >
        {pkg.cta}
      </a>
    </motion.article>
  );
}

export default function Pricing() {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const parentVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // 1. Effect: GlassReveal blur-out animation layout configuration
  const cardVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(20px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 15 } as const
    },
  };

  const staticCardStyles = "bg-white rounded-[1rem] border border-[#0F1717]/5 p-8 flex flex-col items-center text-center shadow-[0_1px_2px_rgba(15,23,23,0.05),0_4px_12px_rgba(15,23,23,0.06)]";

  if (!mounted) {
    return (
      <section className="py-16 bg-[#F9F9F9]" aria-labelledby="pricing-section-title">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="text-center mb-12">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#0A5C5C]">
              Transparent Pricing
            </p>
            <h2 id="pricing-section-title" className="mt-3 text-3xl font-bold tracking-tight text-[#0F1717]">
              Our Premium Packages
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPackages.map((pkg, index) => (
              <article key={index} className={staticCardStyles}>
                <h3 className="text-xl font-semibold text-[#0A5C5C] mb-4">{pkg.title}</h3>
                <p className="text-4xl font-bold text-[#0F1717] mb-6">{pkg.price}</p>
                <ul className="text-[#0F1717]/80 text-sm leading-relaxed list-none p-0 mb-8 flex-grow space-y-3 border-t border-[#0F1717]/5 pt-6 w-full">
                  {pkg.inclusions.map((item, i) => (
                    <li key={i} className="flex items-center justify-center gap-2">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#0A5C5C]" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href={pkg.href} className="mt-auto inline-flex items-center justify-center w-full bg-[#0A5C5C] text-white px-6 py-3 rounded-full text-sm font-semibold">
                  {pkg.cta}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#F9F9F9]" aria-labelledby="pricing-section-title">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="text-center mb-12">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#0A5C5C]">
            Transparent Pricing
          </p>
          <h2 id="pricing-section-title" className="mt-3 text-3xl font-bold tracking-tight text-[#0F1717]">
            Our Premium Packages
          </h2>
        </div>

        <motion.div 
          variants={parentVariants}
          initial={reduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {pricingPackages.map((pkg, index) => (
            <PricingCard
              key={index}
              pkg={pkg}
              cardVariants={cardVariants}
              staticCardStyles={staticCardStyles}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
