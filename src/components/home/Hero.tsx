"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

import { fadeUp, stagger } from "@/lib/motion";
import Container from "@/components/layout/Container";
import ScrambleText from "@/components/ui/ScrambleText";
import LiquidRevealHero from "../../../components/sections/LiquidRevealHero";
import Magnetic from "@/components/ui/Magnetic";

const slides = [
  "/images/clinic_lobby.jpg",
  "/images/treatment_room.jpg",
  "/images/dental_tools.jpg",
];

// Duplicate slides multiple times for infinite-loop horizontal feel
const carouselSlides = [...slides, ...slides, ...slides, ...slides];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();
  
  // Mouse position tracking values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 1. Scroll-linked horizontal mapping (translates leftward at 0.2 speed ratio relative to scrollY)
  const { scrollY } = useScroll();
  const carouselX = useTransform(scrollY, [0, 1000], [0, -200]);

  const blobY = useTransform(scrollY, [0, 600], [0, 90]);
  const blobYReverse = useTransform(scrollY, [0, 600], [0, -70]);
  const indicatorOpacity = useTransform(scrollY, [0, 240], [1, 0]);

  // 5. Parallax rotate effects (stiffness: 60, damping: 18) for expensive 3D layout tilt
  const springConfig = { stiffness: 60, damping: 18 };
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined") {
      // Normalize values between -0.5 and 0.5 relative to viewport center
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  return (
    <section
      aria-labelledby="hero-heading"
      onMouseMove={handleMouseMove}
      className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden pb-16 bg-[#E6E4E1] dark:bg-[#0F1717]"
      style={{ perspective: "1000px" }}
    >
      {/* Premium Liquid Reveal Background */}
      <LiquidRevealHero />

      <Container className="pt-20 pb-10">
        <motion.div
          variants={stagger}
          initial={reduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-2xl"
        >
          <motion.p variants={fadeUp} className="text-eyebrow text-clinic-teal dark:text-clinic-teal-soft">
            DENCITY Dental Care
          </motion.p>
          <motion.h1 variants={fadeUp} id="hero-heading" className="mt-4 text-display">
            <motion.span
              className="inline-block origin-left"
              animate={reduceMotion ? undefined : {
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ScrambleText text="A calmer kind of dental care." delay={100} />
            </motion.span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-body-lg text-muted">
            From routine checkups to complete smile makeovers, we pair gentle,
            unhurried care with modern technology — in a space designed to put
            you at ease.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-pill bg-clinic-teal px-7 py-3.5 font-semibold text-white shadow-soft transition-[background-color,box-shadow] duration-[var(--duration-fast)] hover:bg-clinic-teal/90 hover:shadow-card"
              >
                Book Appointment
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-2 rounded-pill border border-deep-charcoal/15 px-7 py-3.5 font-semibold text-foreground transition-colors duration-[var(--duration-fast)] hover:border-clinic-teal/40 hover:text-clinic-teal dark:border-white/15 dark:hover:text-clinic-teal-soft"
              >
                Explore Services
                <span
                  aria-hidden="true"
                  className="transition-transform duration-[var(--duration-base)] group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </Magnetic>
          </motion.div>
        </motion.div>
      </Container>

      {/* ZenHeroCarousel infinite track */}
      <div className="w-full overflow-hidden relative mt-8 z-20">
        <motion.div
          style={{ x: mounted ? carouselX : 0 }}
          className="flex gap-8 w-max px-6 pb-4"
        >
          {carouselSlides.map((src, i) => (
            <motion.div
              key={i}
              style={{
                rotateX: mounted && !reduceMotion ? rotateX : 0,
                rotateY: mounted && !reduceMotion ? rotateY : 0,
                transformStyle: "preserve-3d",
              }}
              // 4. Smoothness: Rounded-square (16px radius) layout with subtle shadow transition
              className="relative w-80 h-56 rounded-[16px] overflow-hidden shrink-0 border border-deep-charcoal/5 bg-zinc-100 shadow-[0_4px_20px_-5px_rgba(15,23,23,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(15,23,23,0.15)] transition-shadow duration-[var(--duration-base)] will-change-transform"
            >
              <Image
                src={src}
                alt="Clinic luxury interior layout"
                fill
                sizes="320px"
                className="object-cover pointer-events-none select-none"
                priority
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator (desktop only) */}
      <motion.div
        aria-hidden="true"
        style={{ opacity: mounted && !reduceMotion ? indicatorOpacity : 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted lg:flex"
      >
        <span className="text-[0.625rem] font-medium uppercase tracking-[0.2em]">Scroll</span>
        <span className="relative h-8 w-px overflow-hidden bg-deep-charcoal/15 dark:bg-white/15">
          <motion.span
            className="absolute left-0 top-0 h-3 w-px bg-clinic-teal dark:bg-clinic-teal-soft"
            animate={reduceMotion ? undefined : { y: [0, 20, 20], opacity: [1, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
          />
        </span>
      </motion.div>
    </section>
  );
}
