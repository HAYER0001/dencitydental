import type { ReactNode } from "react";

import Container from "@/components/layout/Container";
import Logo from "@/components/layout/Logo";

const openingHours = [
  { days: "Monday – Friday", hours: "8:00 – 18:00" },
  { days: "Saturday", hours: "9:00 – 14:00" },
  { days: "Sunday", hours: "Closed" },
];

type SocialLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37a4 4 0 1 1-7.75 1.26 4 4 0 0 1 7.75-1.26z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-deep-charcoal pb-24 text-white lg:pb-0">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo tone="inverse" />
            <p className="mt-4 max-w-xs text-body-sm text-white/60">
              Modern, gentle dental care for the whole family.
            </p>
          </div>

          <div>
            <h2 className="text-eyebrow text-white/60">Contact</h2>
            {/* Address as an editorial block: distinct lines, tight leading, no icon —
                the typography carries it. */}
            <address className="mt-5 not-italic text-body-lg font-semibold leading-[1.15] tracking-[-0.01em] text-white">
              Swami Vivekananda Nagar
              <br />
              Suratgarh
              <br />
              Rajasthan 335804
            </address>
            <ul className="mt-8 space-y-3 text-body-sm text-white/70">
              <li>
                <a
                  href="tel:+15550123456"
                  className="transition-colors duration-[var(--duration-fast)] hover:text-white"
                >
                  +1 (555) 012-3456
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@dencity.dental"
                  className="transition-colors duration-[var(--duration-fast)] hover:text-white"
                >
                  hello@dencity.dental
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-eyebrow text-white/60">Opening hours</h2>
            <dl className="mt-4 space-y-3 text-body-sm">
              {openingHours.map((entry) => (
                <div key={entry.days} className="flex justify-between gap-4">
                  <dt className="text-white/60">{entry.days}</dt>
                  <dd className="text-white/80">{entry.hours}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="text-eyebrow text-white/60">Follow us</h2>
            <ul className="mt-4 flex gap-3">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-pill border border-white/15 text-white/70 transition-colors duration-[var(--duration-fast)] hover:border-white/40 hover:text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4.5 w-4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {social.icon}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6">
          <p className="text-body-sm text-white/50">
            © {new Date().getFullYear()} DENCITY Dental Care. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
