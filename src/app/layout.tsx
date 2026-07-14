import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConciergeDock from "@/components/layout/ConciergeDock";
import GreetingSequence from "@/components/layout/GreetingSequence";
import CustomCursor from "@/components/layout/CustomCursor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "DENCITY Dental Care",
    template: "%s | DENCITY Dental Care",
  },
  description:
    "Modern, gentle dental care — checkups, cosmetic dentistry and emergency appointments at DENCITY Dental Care.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0A5C5C" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1717" },
  ],
};

// Public site URL — inferred from the clinic email domain. Update if the
// production domain differs.
const SITE_URL = "https://www.dencitydentalcare.in";

// JSON-LD structured data: identifies the clinic to search engines as a
// MedicalClinic / LocalBusiness / Dentist, with address, contact, hours,
// services and practitioners. Rendered as a Server Component script tag.
const clinicJsonLd = {
  "@context": "https://schema.org",
  "@type": ["MedicalClinic", "LocalBusiness", "Dentist"],
  "@id": `${SITE_URL}/#clinic`,
  name: "Dencity Dental Care",
  description:
    "Modern, gentle dental care — implants, orthodontics, aesthetic rehabilitation and preventive dentistry in Suratgarh, Rajasthan.",
  url: SITE_URL,
  telephone: "+91 98296 75893",
  email: "clinic@dencitydentalcare.in",
  image: `${SITE_URL}/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "E-16, near Siyag Hospital, behind LIC Office, PWD Colony",
    addressLocality: "Suratgarh",
    addressRegion: "Rajasthan",
    postalCode: "335804",
    addressCountry: "IN",
  },
  areaServed: {
    "@type": "City",
    name: "Suratgarh",
  },
  // Real aggregate from the clinic's public Google Business profile.
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "131",
    bestRating: "5",
    worstRating: "1",
  },
  medicalSpecialty: [
    "Dentistry",
    "Orthodontic",
    "Prosthodontic",
    "Endodontic",
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Monday",
      opens: "10:00",
      closes: "19:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Tuesday",
      opens: "10:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:30",
    },
  ],
  availableService: [
    { "@type": "MedicalProcedure", name: "Dental Implants" },
    { "@type": "MedicalProcedure", name: "Aesthetic Rehabilitation" },
    { "@type": "MedicalProcedure", name: "Orthodontics" },
    { "@type": "MedicalProcedure", name: "Root Canal Treatment" },
    { "@type": "MedicalProcedure", name: "General & Preventive Dentistry" },
  ],
  employee: [
    {
      "@type": "Physician",
      name: "Dr. Jagjeet Singh",
      jobTitle: "Prosthodontist",
      medicalSpecialty: "Prosthodontic",
    },
    {
      "@type": "Physician",
      name: "Dr. Varun Ahuja",
      jobTitle: "Orthodontist",
      medicalSpecialty: "Orthodontic",
    },
    {
      "@type": "Physician",
      name: "Dr. Manisha",
      jobTitle: "General & Preventive Dentistry (BDS)",
      medicalSpecialty: "Dentistry",
    },
  ],
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Structured data for search engines (MedicalClinic / LocalBusiness). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(clinicJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <GreetingSequence />
        <CustomCursor />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-button focus:bg-clinic-teal focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="flex flex-1 flex-col">
          {/* Per-navigation cinematic transition lives in src/app/template.tsx. */}
          {children}
        </main>
        <Footer />
        <ConciergeDock />
      </body>
    </html>
  );
}
