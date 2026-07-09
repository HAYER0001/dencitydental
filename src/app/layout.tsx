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
