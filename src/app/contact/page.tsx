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
                    <a href="tel:+15550123456" className="hover:text-clinic-teal transition-colors">
                      +1 (555) 012-3456
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Email Inquiries</dt>
                  <dd className="mt-1 text-muted">
                    <a href="mailto:hello@dencity.dental" className="hover:text-clinic-teal transition-colors">
                      hello@dencity.dental
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-card border border-deep-charcoal/5 bg-background p-7 shadow-soft dark:border-white/10">
              <h2 className="text-heading-3 text-clinic-teal dark:text-clinic-teal-soft">Opening Hours</h2>
              <dl className="mt-4 space-y-2 text-body-sm text-muted">
                <div className="flex justify-between">
                  <dt>Monday &ndash; Friday</dt>
                  <dd className="font-medium text-foreground">9:00 AM &ndash; 6:00 PM</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Saturday</dt>
                  <dd className="font-medium text-foreground">9:00 AM &ndash; 2:00 PM</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Sunday</dt>
                  <dd className="text-red-500 font-medium">Closed</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-card border border-deep-charcoal/5 bg-background p-7 shadow-soft dark:border-white/10">
              <h2 className="text-heading-3 text-clinic-teal dark:text-clinic-teal-soft">Our Location</h2>
              <p className="mt-4 text-body-sm text-muted leading-relaxed">
                DENCITY Dental Care<br />
                100 Premium Clinic Square<br />
                Suite 400, Medical District
              </p>
              <p className="mt-4">
                <a
                  href="https://maps.google.com/?q=DENCITY+Dental+Care"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm font-semibold text-clinic-teal hover:underline dark:text-clinic-teal-soft"
                >
                  Get Directions &rarr;
                </a>
              </p>
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
