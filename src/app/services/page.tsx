import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import Magnetic from "@/components/ui/Magnetic";

export const metadata: Metadata = {
  title: "Dental Services",
  description: "Explore our premium dental treatments including general dentistry, cosmetic makeovers, orthodontic aligners, and dental implants.",
};

type ServiceDetail = {
  id: string;
  title: string;
  specialist: string;
  description: string;
  treatments: string[];
};

const serviceDetails: ServiceDetail[] = [
  {
    id: "general",
    title: "General Dentistry",
    specialist: "Dr. Maya Sharma",
    description: "Keep your teeth and gums healthy for life. We focus on preventive maintenance, digital diagnostics, and conservative restoration methods.",
    treatments: ["Comprehensive Oral Exams", "Digital Low-Radiation X-Rays", "Ultrasonic Hygiene Cleanings", "Mercury-Free Composite Fillings"],
  },
  {
    id: "cosmetic",
    title: "Cosmetic Dentistry",
    specialist: "Dr. Maya Sharma",
    description: "Design the smile of your dreams. Our custom aesthetic services combine art and science to enhance your teeth while preserving structural integrity.",
    treatments: ["Digital Smile Previewing", "Porcelain Veneers & Crowns", "In-Office Teeth Whitening", "Composite Resin Bonding"],
  },
  {
    id: "ortho",
    title: "Orthodontics",
    specialist: "Dr. Arjun Mehta",
    description: "Achieve optimal alignment and a healthier bite. We offer modern clear aligner systems and discreet braces for kids, teens, and adults.",
    treatments: ["Discreet Clear Aligners", "Traditional Ceramic Braces", "Retainers & Post-Care", "Interceptive Pediatric Orthodontics"],
  },
  {
    id: "implants",
    title: "Dental Implants",
    specialist: "Dr. Daniel Okafor",
    description: "Restore missing teeth permanently. Implants look, feel, and function exactly like natural teeth, preventing bone loss and maintaining facial structure.",
    treatments: ["3D-Guided Implant Surgery", "Biocompatible Titanium Implants", "Realistic Custom Ceramic Crowns", "Full-Arch Rehabilitation"],
  },
  {
    id: "pediatric",
    title: "Pediatric Dentistry",
    specialist: "Dr. Elena Rodrigues",
    description: "Caring, unhurried dental care for our youngest patients. We make visits fun, build positive habits early, and monitor developmental milestones.",
    treatments: ["Gentle Child Screenings", "Fissure Sealants", "Fluoride Applications", "Parental Care Education"],
  },
  {
    id: "emergency",
    title: "Emergency Care",
    specialist: "Dr. Daniel Okafor",
    description: "Immediate support when you need it most. We prioritize same-day emergency slots to relieve pain, repair fractures, and treat infections.",
    treatments: ["Severe Toothache Relief", "Broken Restoration Repairs", "Knocked-out Tooth Re-implantation", "Dental Infection Treatments"],
  },
];

export default function ServicesPage() {
  return (
    <section className="relative flex-1 py-section-sm">
      {/* Background decoration */}
      <div aria-hidden="true" className="absolute top-1/4 right-[5%] -z-10 h-96 w-96 rounded-full bg-clinic-teal/5 blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-1/4 left-[5%] -z-10 h-96 w-96 rounded-full bg-clinic-teal-soft/10 blur-3xl" />

      <Container>
        <div className="max-w-2xl">
          <p className="text-eyebrow text-clinic-teal dark:text-clinic-teal-soft">Treatments catalogue</p>
          <h1 className="mt-3 text-display">Dental Services</h1>
          <p className="mt-4 text-body-lg text-muted">
            We pair careful, unhurried care with modern technology to deliver premium results across all aspects of dental health.
          </p>
        </div>

        <div className="mt-16 space-y-12">
          {serviceDetails.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <article
                key={service.id}
                className={`grid gap-8 rounded-card border border-deep-charcoal/5 bg-background p-8 shadow-soft dark:border-white/10 md:grid-cols-[3fr_2fr] md:p-10 ${
                  isEven ? "" : "md:grid-cols-[2fr_3fr] md:direction-rtl"
                }`}
              >
                <div className={isEven ? "md:pr-6" : "md:pl-6 md:direction-ltr"}>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-clinic-teal dark:text-clinic-teal-soft">
                    Specialist: {service.specialist}
                  </p>
                  <h2 className="mt-2.5 text-heading-2">{service.title}</h2>
                  <p className="mt-4 text-body text-muted leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className={`flex flex-col justify-between border-t border-deep-charcoal/5 pt-6 dark:border-white/10 md:border-t-0 md:border-l md:pl-8 md:pt-0 ${
                  isEven ? "md:border-l-deep-charcoal/5" : "md:border-r md:border-l-0 md:pr-8 md:pl-0 md:border-r-deep-charcoal/5"
                }`}>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                      Included Procedures
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {service.treatments.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-body-sm text-foreground/80">
                          <svg
                            viewBox="0 0 24 24"
                            className="mt-0.5 h-4.5 w-4.5 shrink-0 text-clinic-teal dark:text-clinic-teal-soft"
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
                  </div>

                  <div className="mt-8">
                    <Magnetic className="block w-full" strength={0.12} glow>
                      <Link
                        href={`/book?treatment=${service.id}`}
                        className="inline-flex w-full items-center justify-center rounded-pill bg-clinic-teal px-5 py-3 text-body-sm font-semibold text-white shadow-soft transition-colors duration-[var(--duration-fast)] hover:bg-clinic-teal/90 active:bg-clinic-teal/90"
                      >
                        Book Appointment
                      </Link>
                    </Magnetic>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
