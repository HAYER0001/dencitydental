"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { springs } from "@/lib/motion";

export type DockAction = {
  label: string;
  href: string;
  icon: ReactNode;
  /** Renders a plain <a target="_blank"> instead of a Next.js Link. */
  external?: boolean;
  /** Highlights the action in clinic teal. */
  primary?: boolean;
};

const defaultActions: DockAction[] = [
  {
    label: "Book",
    href: "/book",
    primary: true,
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
  },
  {
    label: "Call",
    href: "tel:+15550123456",
    external: true,
    icon: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    ),
  },
  {
    label: "Directions",
    href: "https://maps.google.com/?q=DENCITY+Dental+Care",
    external: true,
    icon: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/15550123456",
    external: true,
    icon: (
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    ),
  },
];

function DockButton({ action }: { action: DockAction }) {
  const className = `flex flex-col items-center gap-1 rounded-pill px-2 py-2.5 text-[0.6875rem] font-medium transition-[color,transform] duration-[var(--duration-fast)] active:scale-95 ${
    action.primary
      ? "text-clinic-teal dark:text-clinic-teal-soft"
      : "text-foreground/70 hover:text-foreground"
  }`;

  const icon = (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {action.icon}
    </svg>
  );

  if (action.external) {
    const isWebLink = action.href.startsWith("http");
    return (
      <a
        href={action.href}
        className={className}
        {...(isWebLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {icon}
        {action.label}
      </a>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {icon}
      {action.label}
    </Link>
  );
}

export default function ConciergeDock({ actions = defaultActions }: { actions?: DockAction[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <nav
      aria-label="Quick actions"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <motion.div
        initial={{ y: 96, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={reduceMotion ? { duration: 0 } : springs.gentle}
        className="pointer-events-auto mx-auto grid max-w-md grid-cols-4 rounded-pill border border-deep-charcoal/10 bg-background/80 px-2 py-1 shadow-lifted backdrop-blur-md dark:border-white/10"
      >
        {actions.map((action) => (
          <DockButton key={action.label} action={action} />
        ))}
      </motion.div>
    </nav>
  );
}
