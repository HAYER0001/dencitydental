import type { Metadata } from "next";

import Container from "@/components/layout/Container";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with DENCITY Dental Care. Find our opening hours, address, phone number, and location details.",
};

export default function ContactPage() {
  return (
    <section className="relative flex-1 py-section-sm">
      {/* Background radial highlight */}
      <div aria-hidden="true" className="absolute top-1/4 right-[5%] -z-10 h-96 w-96 rounded-full bg-clinic-teal/5 blur-3xl pointer-events-none" />

      <Container>
        <div className="max-w-2xl mb-12">
          <p className="text-eyebrow text-clinic-teal dark:text-clinic-teal-soft">Get in touch</p>
          <h1 className="mt-3 text-display">Contact Us</h1>
          <p className="mt-4 text-body-lg text-muted">
            Have questions about a treatment or need help scheduling? Reach out via phone, email, or by filling out the form.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-[2fr_3fr]">
          {/* Contact details */}
          <div className="space-y-8">
            <div className="rounded-card border border-deep-charcoal/5 bg-background p-7 shadow-soft dark:border-white/10">
              <h2 className="text-heading-3 text-clinic-teal dark:text-clinic-teal-soft">Quick Contact</h2>
              <dl className="mt-4 space-y-4 text-body-sm">
                <div>
                  <dt className="font-semibold text-foreground">Phone Support</dt>
                  <dd className="mt-1 text-muted">
                    <a href="tel:+919829675893" className="hover:text-clinic-teal active:text-clinic-teal transition-colors">
                      +91 98296 75893
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Email Inquiries</dt>
                  <dd className="mt-1 text-muted">
                    <a href="mailto:clinic@dencitydentalcare.in" className="hover:text-clinic-teal active:text-clinic-teal transition-colors">
                      clinic@dencitydentalcare.in
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-card border border-deep-charcoal/5 bg-background p-7 shadow-soft dark:border-white/10">
              <h2 className="text-heading-3 text-clinic-teal dark:text-clinic-teal-soft">Opening Hours</h2>
              <dl className="mt-4 space-y-2 text-body-sm text-muted">
                <div className="flex justify-between">
                  <dt>Monday</dt>
                  <dd className="font-medium text-foreground">10:00 AM &ndash; 7:30 PM</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Tuesday</dt>
                  <dd className="font-medium text-foreground">10:00 AM &ndash; 7:00 PM</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Wednesday &ndash; Saturday</dt>
                  <dd className="font-medium text-foreground">10:00 AM &ndash; 7:30 PM</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Sunday</dt>
                  <dd className="text-red-500 font-medium">Closed</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-card border border-deep-charcoal/5 bg-background p-9 shadow-soft dark:border-white/10">
              <h2 className="text-eyebrow text-clinic-teal dark:text-clinic-teal-soft">Visit the practice</h2>
              {/* Editorial address: full brutalist heading scale, aggressive leading,
                  broken into clean print-style lines. No map-pin icon — type alone. */}
              <address className="mt-8 not-italic text-heading-3 leading-[1.1] text-foreground">
                Swami Vivekananda Nagar
                <br />
                Opposite Siyag Hospital
                <br />
                Suratgarh
                <br />
                Rajasthan 335804
              </address>
              <a
                href="https://maps.google.com/?q=Swami+Vivekananda+Nagar+Opposite+Siyag+Hospital+Suratgarh+Rajasthan+335804"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-block text-eyebrow text-clinic-teal transition-colors hover:text-clinic-teal/70 active:text-clinic-teal/70 dark:text-clinic-teal-soft"
              >
                Get Directions
              </a>
            </div>
          </div>

          {/* Form wrapper */}
          <div className="rounded-card border border-deep-charcoal/5 bg-background p-8 shadow-soft dark:border-white/10">
            <h2 className="text-heading-2">Send us a message</h2>
            <p className="mt-2 text-body-sm text-muted">
              Fill out the form below and we&apos;ll get back to you within 24 hours.
            </p>

            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
