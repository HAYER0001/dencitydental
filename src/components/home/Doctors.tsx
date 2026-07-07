"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import Container from "@/components/layout/Container";

export type Doctor = {
  name: string;
  qualification: string;
  specialization: string;
  experience: string;
  bio: string;
  image?: string;
};

const defaultDoctors: Doctor[] = [
  {
    name: "Dr. Maya Sharma",
    qualification: "BDS, MDS (Prosthodontics)",
    specialization: "Cosmetic & Restorative Dentistry",
    experience: "15+ years experience",
    bio: "Leads our smile design practice with a gentle, detail-first approach honed over thousands of restorations.",
  },
  {
    name: "Dr. Arjun Mehta",
    qualification: "BDS, MDS (Orthodontics)",
    specialization: "Orthodontics & Clear Aligners",
    experience: "12+ years experience",
    bio: "Specialist in discreet aligner therapy and complex bite correction for teens and adults.",
  },
  {
    name: "Dr. Elena Rodrigues",
    qualification: "BDS, PG Dip (Paediatric Dentistry)",
    specialization: "Pediatric Dentistry",
    experience: "8+ years experience",
    bio: "Makes first dental visits feel easy — trusted by our youngest patients and their parents.",
  },
  {
    name: "Dr. Daniel Okafor",
    qualification: "BDS, MDS (Oral & Maxillofacial Surgery)",
    specialization: "Implants & Oral Surgery",
    experience: "10+ years experience",
    bio: "From single implants to full-arch rehabilitation, focused on comfort-first surgical care.",
  },
];

function initials(name: string) {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article
      className="h-full overflow-hidden rounded-card border border-deep-charcoal/5 bg-background shadow-soft transition-[box-shadow,transform] duration-[var(--duration-base)] hover:-translate-y-0.5 hover:shadow-card motion-reduce:hover:translate-y-0 dark:border-white/10"
    >
      <div className="relative aspect-[4/3]">
        {doctor.image ? (
          <Image
            src={doctor.image}
            alt={`Portrait of ${doctor.name}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center bg-gradient-to-br from-clinic-teal/15 via-surface to-surface"
          >
            <span className="text-heading-1 tracking-widest text-clinic-teal/70 dark:text-clinic-teal-soft/60">
              {initials(doctor.name)}
            </span>
          </div>
        )}
      </div>

      <div className="flex h-full flex-col p-6 sm:p-7">
        <p className="text-eyebrow text-clinic-teal dark:text-clinic-teal-soft">
          {doctor.specialization}
        </p>
        <h3 className="mt-2 text-heading-3">{doctor.name}</h3>
        <p className="mt-1 text-body-sm text-muted">{doctor.qualification}</p>
        <p className="mt-3 text-body-sm text-muted">{doctor.bio}</p>
        <p className="mt-auto pt-4">
          <span className="inline-block rounded-pill bg-surface px-3 py-1 text-body-sm font-medium text-foreground/80">
            {doctor.experience}
          </span>
        </p>
      </div>
    </article>
  );
}

export default function Doctors({ doctors = defaultDoctors }: { doctors?: Doctor[] }) {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  // 4. SSR Safety: Guard with mounted check so layout does not collapse on initial server render
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

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } as const
    },
  };

  if (!mounted) {
    return (
      <section aria-labelledby="doctors-heading" className="py-section">
        <Container>
          <div className="max-w-2xl">
            <p className="text-eyebrow text-clinic-teal dark:text-clinic-teal-soft">Our team</p>
            <h2 id="doctors-heading" className="mt-3 text-heading-1">
              Meet the doctors
            </h2>
            <p className="mt-4 text-body-lg text-muted">
              Four specialists, one philosophy: careful, unhurried dentistry that puts you at ease.
            </p>
          </div>
          {/* 1. Layout: Enforce gap-8 and grid-cols-1 md:grid-cols-2 lg:grid-cols-3 */}
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <div key={doctor.name} className="list-none">
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section aria-labelledby="doctors-heading" className="py-section">
      <Container>
        <div className="max-w-2xl">
          <p className="text-eyebrow text-clinic-teal dark:text-clinic-teal-soft">Our team</p>
          <h2 id="doctors-heading" className="mt-3 text-heading-1">
            Meet the doctors
          </h2>
          <p className="mt-4 text-body-lg text-muted">
            Four specialists, one philosophy: careful, unhurried dentistry that puts you at ease.
          </p>
        </div>

        {/* 2. Scroll Logic: Wrap container in motion.div, whileInView, and viewport once amount: 0.2 */}
        <motion.div
          variants={parentVariants}
          initial={reduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {doctors.map((doctor) => (
            <motion.div key={doctor.name} variants={cardVariants} className="list-none">
              <DoctorCard doctor={doctor} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
