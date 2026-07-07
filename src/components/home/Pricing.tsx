"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { fadeUp, stagger } from "@/lib/motion";
import Container from "@/components/layout/Container";

export type PricingPlan = {
  title: string;
  /** Small qualifier before the price, e.g. "from". */
  prefix?: string;
  price: string;
  /** Small qualifier after the price, e.g. "per visit". */
  period?: string;
  description?: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

const defaultPlans: PricingPlan[] = [
  {
    title: "Preventive Care",
    price: "$99",
    period: "per visit",
    description: "Everything you need for a healthy baseline.",
    features: [
      "Comprehensive exam & digital X-rays",
      "Professional cleaning & polish",
      "Gum health screening",
      "Personalized care plan",
    ],
    cta: { label: "Book a checkup", href: "/book" },
  },
  {
    title: "Smile Makeover",
    prefix: "from",
    price: "$1,499",
    description: "A complete, natural-looking smile transformation.",
    features: [
      "Digital smile design preview",
      "Professional whitening",
      "Porcelain veneers or bonding",
      "Flexible payment plans",
    ],
    cta: { label: "Book a consultation", href: "/book" },
    featured: true,
  },
  {
    title: "Implant Care",
    prefix: "from",
    price: "$2,900",
    period: "per implant",
    description: "Permanent replacements that look and feel natural.",
    features: [
      "3D-guided implant placement",
      "Titanium implant & ceramic crown",
      "Sedation options available",
      "Lifetime implant check-ins",
    ],
    cta: { label: "Book a consultation", href: "/book" },
  },
];

export function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-card border bg-background p-7 shadow-soft transition-[box-shadow,transform,border-color] duration-[var(--duration-base)] hover:-translate-y-1 hover:shadow-card motion-reduce:hover:translate-y-0 ${
        plan.featured
          ? "border-clinic-teal/40 ring-1 ring-clinic-teal/40"
          : "border-deep-charcoal/5 hover:border-clinic-teal/25 dark:border-white/10"
      }`}
    >
      {plan.featured && (
        <p className="absolute -top-3 left-7 rounded-pill bg-clinic-teal px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-white">
          Most popular
        </p>
      )}

      <h3 className="text-heading-3">{plan.title}</h3>
      {plan.description && <p className="mt-2 text-body-sm text-muted">{plan.description}</p>}

      <p className="mt-6 flex items-baseline gap-2">
        {plan.prefix && <span className="text-body-sm text-muted">{plan.prefix}</span>}
        <span className="text-heading-1 tabular-nums">{plan.price}</span>
        {plan.period && <span className="text-body-sm text-muted">{plan.period}</span>}
      </p>

      <ul className="mt-6 space-y-3 border-t border-deep-charcoal/5 pt-6 dark:border-white/10">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-body-sm">
            <svg
              viewBox="0 0 24 24"
              className="mt-0.5 h-4 w-4 shrink-0 text-clinic-teal dark:text-clinic-teal-soft"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span className="text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>

      <p className="mt-auto pt-8">
        <Link
          href={plan.cta.href}
          className={`inline-flex w-full items-center justify-center rounded-pill px-5 py-3 font-semibold transition-colors duration-[var(--duration-fast)] ${
            plan.featured
              ? "bg-clinic-teal text-white shadow-soft hover:bg-clinic-teal/90"
              : "border border-deep-charcoal/15 text-foreground hover:border-clinic-teal/40 hover:text-clinic-teal dark:border-white/15 dark:hover:text-clinic-teal-soft"
          }`}
        >
          {plan.cta.label}
        </Link>
      </p>
    </article>
  );
}

export default function Pricing({ plans = defaultPlans }: { plans?: PricingPlan[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="pricing-heading"
      className="border-y border-deep-charcoal/5 bg-surface/60 dark:border-white/5"
    >
      <Container className="py-section">
        <div className="max-w-2xl">
          <p className="text-eyebrow text-clinic-teal dark:text-clinic-teal-soft">
            Transparent pricing
          </p>
          <h2 id="pricing-heading" className="mt-3 text-heading-1">
            Care packages
          </h2>
          <p className="mt-4 text-body-lg text-muted">
            Clear, honest pricing for the treatments patients ask about most.
          </p>
        </div>

        <motion.ul
          variants={stagger}
          initial={reduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid gap-6 lg:grid-cols-3"
        >
          {plans.map((plan) => (
            <motion.li key={plan.title} variants={fadeUp} className="pt-3">
              <PricingCard plan={plan} />
            </motion.li>
          ))}
        </motion.ul>

        <p className="mt-8 text-body-sm text-muted">
          Prices are indicative — you&apos;ll receive an exact quote after your
          consultation. Insurance and financing options available.
        </p>
      </Container>
    </section>
  );
}
