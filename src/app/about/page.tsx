import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the DENCITY Dental Care philosophy, our state-of-the-art practice, and our mission to make dental care calm and comfortable.",
};

export default function AboutPage() {
  return (
    <section className="relative flex-1 py-section-sm">
      {/* Decorative gradients */}
      <div aria-hidden="true" className="absolute top-12 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-clinic-teal/5 blur-3xl" />

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-eyebrow text-clinic-teal dark:text-clinic-teal-soft">Our philosophy</p>
          <h1 className="mt-3 text-display text-center">A calmer kind of dental care</h1>
          <p className="mt-6 text-body-lg text-muted">
            We founded DENCITY to solve a simple problem: too many people avoid the dentist due to anxiety, rushed environments, or opaque pricing. We designed our practice from the ground up to feel warm, clear, and reassuring.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="rounded-card border border-deep-charcoal/5 bg-background p-7 shadow-soft dark:border-white/10">
            <h2 className="text-heading-3 text-clinic-teal dark:text-clinic-teal-soft">Uncompromised Comfort</h2>
            <p className="mt-4 text-body-sm text-muted leading-relaxed">
              We take the time to listen, explain every step, and work at your pace. From warm neck pillows to gentle, modern procedures, your comfort is our absolute priority.
            </p>
          </div>
          <div className="rounded-card border border-deep-charcoal/5 bg-background p-7 shadow-soft dark:border-white/10">
            <h2 className="text-heading-3 text-clinic-teal dark:text-clinic-teal-soft">Advanced Technology</h2>
            <p className="mt-4 text-body-sm text-muted leading-relaxed">
              From low-radiation digital diagnostics to 3D guided surgery, we utilize state-of-the-art dental tech to ensure your treatment is precise, fast, and minimally invasive.
            </p>
          </div>
          <div className="rounded-card border border-deep-charcoal/5 bg-background p-7 shadow-soft dark:border-white/10">
            <h2 className="text-heading-3 text-clinic-teal dark:text-clinic-teal-soft">Honest Transparency</h2>
            <p className="mt-4 text-body-sm text-muted leading-relaxed">
              No hidden costs or surprise procedures. We provide clear, itemized quotes before any treatment begins, and we help you navigate insurance and financing options.
            </p>
          </div>
        </div>

        <div className="mt-20 rounded-card border border-deep-charcoal/5 bg-surface/50 p-8 text-center dark:border-white/5 dark:bg-white/5 md:p-12">
          <h2 className="text-heading-2">Ready to experience the difference?</h2>
          <p className="mx-auto mt-4 max-w-xl text-body text-muted">
            Join the 10,000+ patients who have found a calm, trusted home for their dental care at DENCITY.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-pill bg-clinic-teal px-6 py-3.5 font-semibold text-white shadow-soft transition-colors duration-[var(--duration-fast)] hover:bg-clinic-teal/90 active:bg-clinic-teal/90"
            >
              Book an Appointment
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-pill border border-deep-charcoal/15 px-6 py-3.5 font-semibold text-foreground transition-colors duration-[var(--duration-fast)] hover:border-clinic-teal/40 active:border-clinic-teal/40 hover:text-clinic-teal active:text-clinic-teal dark:border-white/15 dark:hover:text-clinic-teal-soft dark:active:text-clinic-teal-soft"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
