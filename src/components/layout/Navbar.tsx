"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { bookLink, navLinks, signInLink } from "@/lib/navigation";
import { durations, easings } from "@/lib/motion";
import Container from "@/components/layout/Container";
import Logo from "@/components/layout/Logo";
import Magnetic from "@/components/ui/Magnetic";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Meditation Mode theme state synchronization
  const [isCalmActive, setIsCalmActive] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsCalmActive(document.documentElement.classList.contains("calm-theme"));
    }
  }, []);

  const toggleCalmTheme = () => {
    const newActive = !isCalmActive;
    setIsCalmActive(newActive);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("calm-theme", newActive);
    }
  };

  const close = useCallback(() => setOpen(false), []);

  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktopChange);
    const toggle = toggleRef.current;
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktopChange);
      toggle?.focus();
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40">
      {/* 1. Background: bg-[#E6E4E1]/80 and backdrop-blur-md for premium glass look */}
      <div className="border-b border-deep-charcoal/10 bg-[#E6E4E1]/80 backdrop-blur-md dark:bg-[#0F1717]/80 dark:border-white/10">
        <Container>
          <nav aria-label="Main" className="flex h-16 items-center justify-between gap-6">
            <Logo />

            <ul className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Magnetic>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`block rounded-button px-3 py-2 text-body-sm font-medium transition-colors duration-[var(--duration-fast)] ${
                          active
                            ? "text-clinic-teal font-semibold"
                            : "text-foreground/70 hover:bg-white/40 hover:text-foreground dark:hover:bg-white/10"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </Magnetic>
                  </li>
                );
              })}
            </ul>

            <div className="hidden items-center gap-4 md:flex">
              {/* 4. Accessibility: Elegant Meditation Mode toggle switch */}
              <button
                onClick={toggleCalmTheme}
                aria-label="Toggle Meditation Mode"
                className={`inline-flex items-center gap-2 rounded-pill px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-wider border transition-all duration-[var(--duration-fast)] ${
                  isCalmActive
                    ? "bg-[#0A5C5C] border-[#0A5C5C] text-white shadow-soft"
                    : "border-deep-charcoal/15 text-foreground/80 hover:border-clinic-teal/40 hover:text-clinic-teal dark:border-white/15"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isCalmActive ? "bg-white animate-pulse" : "bg-deep-charcoal/30 dark:bg-white/30"}`} />
                <span>Meditation Mode</span>
              </button>

              <Magnetic>
                <Link
                  href={signInLink.href}
                  className="rounded-button px-3 py-2 text-body-sm font-medium text-foreground/70 transition-colors duration-[var(--duration-fast)] hover:text-foreground active:text-foreground"
                >
                  {signInLink.label}
                </Link>
              </Magnetic>
              <Magnetic glow>
                <Link
                  href={bookLink.href}
                  className="rounded-pill bg-clinic-teal px-5 py-2.5 text-body-sm font-semibold text-white shadow-soft transition-[background-color,box-shadow] duration-[var(--duration-fast)] hover:bg-clinic-teal/90 active:bg-clinic-teal/90 hover:shadow-card active:shadow-card"
                >
                  {bookLink.label}
                </Link>
              </Magnetic>
            </div>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-button text-foreground transition-colors duration-[var(--duration-fast)] hover:bg-white/40 active:bg-white/40 md:hidden"
            >
              <span aria-hidden="true" className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 top-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-[var(--duration-base)] ${
                    open ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] block h-0.5 w-5 rounded-full bg-current transition-opacity duration-[var(--duration-base)] ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 block h-0.5 w-5 rounded-full bg-current transition-transform duration-[var(--duration-base)] ${
                    open ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </nav>
        </Container>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              aria-hidden="true"
              onClick={close}
              className="fixed inset-0 z-40 bg-deep-charcoal/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : durations.base, ease: easings.outSoft }}
            />
            <motion.aside
              key="drawer"
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
              className="fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] flex-col bg-background shadow-lifted md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: reduceMotion ? 0 : durations.slow, ease: easings.outExpo }}
            >
              <div className="flex h-16 items-center justify-between border-b border-deep-charcoal/10 px-gutter dark:border-white/10">
                <span className="text-eyebrow text-muted">Menu</span>
                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Close menu"
                  onClick={close}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-button text-foreground/70 transition-colors duration-[var(--duration-fast)] hover:bg-surface active:bg-surface hover:text-foreground active:text-foreground"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <nav
                aria-label="Mobile"
                className="flex flex-1 flex-col justify-between overflow-y-auto px-gutter py-6"
              >
                <ul className="flex flex-col gap-1">
                  {[...navLinks, signInLink].map((link) => {
                    const active = isActive(pathname, link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          aria-current={active ? "page" : undefined}
                          onClick={close}
                          className={`block rounded-button px-3 py-3 text-lg font-medium transition-colors duration-[var(--duration-fast)] ${
                            active
                              ? "bg-[#E6E4E1]/50 text-clinic-teal font-semibold"
                              : "text-foreground/80 hover:bg-surface hover:text-foreground"
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-auto pt-6 flex flex-col gap-4">
                  {/* Mobile Meditation Mode Switch */}
                  <button
                    onClick={toggleCalmTheme}
                    aria-label="Toggle Meditation Mode"
                    className={`inline-flex items-center justify-center gap-2.5 rounded-pill w-full py-3 text-sm font-semibold border transition-all duration-[var(--duration-fast)] ${
                      isCalmActive
                        ? "bg-[#0A5C5C] border-[#0A5C5C] text-white shadow-soft"
                        : "border-deep-charcoal/15 text-foreground/80 dark:border-white/15"
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${isCalmActive ? "bg-white animate-pulse" : "bg-deep-charcoal/30 dark:bg-white/30"}`} />
                    <span>Meditation Mode</span>
                  </button>

                  <Link
                    href={bookLink.href}
                    onClick={close}
                    className="inline-flex items-center justify-center rounded-pill bg-clinic-teal px-5 py-3 font-semibold text-white shadow-soft transition-colors duration-[var(--duration-fast)] hover:bg-clinic-teal/90 active:bg-clinic-teal/90"
                  >
                    {bookLink.label}
                  </Link>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
