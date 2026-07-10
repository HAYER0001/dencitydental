"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useAntiGravity } from "@/lib/useAntiGravity";
import HeroGallery3D from "@/components/HeroGallery3D";

gsap.registerPlugin(ScrollTrigger);

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);

  const reduceMotion = useReducedMotion();

  // Anti-gravity: the bespoke tooth floats on a heavy, slow spring — the hero centrepiece,
  // so a touch more travel and mass than the cards elsewhere.
  const toothFloatY = useAntiGravity({ amplitude: 16, stiffness: 15, damping: 12, mass: 1.9 });

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set(text1Ref.current, { autoAlpha: 1 });
    gsap.set([text2Ref.current, text3Ref.current], { autoAlpha: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    tl.to(text1Ref.current, { autoAlpha: 0, scale: 0.9, duration: 1 })
      .fromTo(text2Ref.current, { scale: 1.1 }, { autoAlpha: 1, scale: 1, duration: 1 })
      .to(text2Ref.current, { autoAlpha: 0, scale: 0.9, duration: 1 })
      .fromTo(text3Ref.current, { scale: 1.1 }, { autoAlpha: 1, scale: 1, duration: 1 });

  }, { scope: containerRef });

  return (
    <div id="hero-3d-wrapper" ref={containerRef} className="relative h-[400vh] w-full bg-[#0F1717]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">

        {/* Single authoritative page h1 for screen readers and crawlers — the
            animated hero wordmark below is decorative, so the semantic outline
            starts here. */}
        <h1 className="sr-only">
          Dencity Dental Care — Future Dentistry Clinic in Suratgarh, Rajasthan
        </h1>

        <div className="absolute inset-0 z-0">
          <Image src="/gallery/living-room.JPG" alt="Dencity Dental Care clinic interior in Suratgarh" fill style={{ objectFit: "cover", opacity: 0.2 }} priority />
        </div>

        {/* Deep-perspective 3D clinic gallery — floats and dollies behind the
            typography, driven by the same 400vh scroll (z-0 < z-[3] < z-[5] < z-10). */}
        <HeroGallery3D scrollTargetRef={containerRef} />

        {/* Code-driven luxury mark — floats between the dark backdrop and the massive
            mix-blend-difference typography (z-0 < z-[5] < z-10). */}
        <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[52vw] max-w-[320px]"
            style={{ y: toothFloatY }}
            animate={reduceMotion ? undefined : { rotate: [-3, 3, -3] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 9, repeat: Infinity, ease: [0.37, 0, 0.63, 1] }
            }
          >
            <svg
              viewBox="0 0 100 116"
              fill="none"
              aria-hidden="true"
              className="h-auto w-full"
              style={{ filter: "drop-shadow(0 0 20px rgba(255,255,255,0.3))" }}
            >
              {/* Clinically accurate, professional molar silhouette with high-end anatomical detailing. */}
              <path
                d="M 32 20
                   C 41 24, 49 24, 50 24
                   C 51 24, 59 24, 68 20
                   C 76 18, 83 26, 83 38
                   C 83 46, 78 52, 75 56
                   C 72 62, 70 78, 68 96
                   C 67 101, 62 101, 61 96
                   C 59 84, 56 68, 50 68
                   C 44 68, 41 84, 39 96
                   C 38 101, 33 101, 32 96
                   C 30 78, 28 62, 25 56
                   C 22 52, 17 46, 17 38
                   C 17 26, 24 18, 32 20 Z"
                stroke="#ffffff"
                strokeWidth={3}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Cementoenamel junction (cervical line) */}
              <path
                d="M 25 56 C 35 59, 65 59, 75 56"
                stroke="#ffffff"
                strokeOpacity={0.3}
                strokeWidth={2}
                strokeLinecap="round"
              />
              {/* Occlusal developmental grooves */}
              <path
                d="M 50 24 V 44 M 36 34 C 42 38, 58 38, 64 34"
                stroke="#ffffff"
                strokeOpacity={0.45}
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none">
          <div ref={text1Ref} className="absolute inset-0 flex flex-col items-center justify-center text-center text-white uppercase font-black tracking-tighter leading-[0.85] text-[10vw] md:text-[12vw] mix-blend-difference">
            <div>CLINIC FOR<br/>FUTURE<br/>DENTISTRY</div>
          </div>
          <div ref={text2Ref} className="absolute inset-0 flex flex-col items-center justify-center text-center text-white uppercase font-black tracking-tighter leading-[0.85] text-[10vw] md:text-[12vw] mix-blend-difference">
            <div>DENCITY<br/>DENTAL CARE</div>
          </div>
          <div ref={text3Ref} className="absolute inset-0 flex flex-col items-center justify-center text-center text-white uppercase font-black tracking-tighter leading-[0.85] text-[10vw] md:text-[12vw] mix-blend-difference">
            <div>YOUR PERFECT<br/>SMILE</div>
          </div>
        </div>

      </div>
    </div>
  );
}
