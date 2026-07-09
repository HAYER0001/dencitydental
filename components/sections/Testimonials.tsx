"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { Star } from "lucide-react";

export type Testimonial = {
  id: string;
  name: string;
  treatment: string;
  rating: number;
  review: string;
  avatarLetter: string;
};

const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Jenkins",
    treatment: "Smile Makeover",
    rating: 5,
    review: "I couldn't be happier with my smile makeover! Dr. Sharma took the time to explain every option. The whole experience was gentle and completely pain-free.",
    avatarLetter: "S",
  },
  {
    id: "t2",
    name: "David Chen",
    treatment: "Dental Implants",
    rating: 5,
    review: "The implant procedure was incredibly smooth. Dr. Daniel Okafor's planning was so precise. I felt absolutely zero discomfort and the result is perfect.",
    avatarLetter: "D",
  },
  {
    id: "t3",
    name: "Priya Patel",
    treatment: "Orthodontics",
    rating: 5,
    review: "My clear aligner journey was a breeze. Dr. Arjun Mehta is a master of his craft. The process was unhurried, clean, and extremely professional.",
    avatarLetter: "P",
  },
  {
    id: "t4",
    name: "Marcus Vance",
    treatment: "General Dentistry",
    rating: 5,
    review: "Going to the dentist used to cause me anxiety, but DENCITY has completely changed that. The space is calming, the staff is gentle, and they never rush.",
    avatarLetter: "M",
  },
  {
    id: "t5",
    name: "Emily Watson",
    treatment: "Pediatric Dentistry",
    rating: 5,
    review: "Dr. Elena Rodrigues is amazing with kids! My 6-year-old daughter actually looks forward to her checkups now. A truly family-friendly practice.",
    avatarLetter: "E",
  },
];

export default function Testimonials() {
  const [mounted, setMounted] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  
  const x = useMotionValue(0);
  const controlsRef = useRef<any>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate testimonials for infinite horizontal scrolling
  const doubledTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    // SSR guard
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !trackRef.current) return;

    // Guard container width check cleanly
    const measureWidth = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth / 2);
      }
    };

    measureWidth();
    
    // Recalculate on window resize for responsiveness
    window.addEventListener("resize", measureWidth);
    return () => window.removeEventListener("resize", measureWidth);
  }, [mounted]);

  // Framer Motion continuous scrolling animation
  useEffect(() => {
    if (trackWidth === 0) return;

    controlsRef.current = animate(x, [0, -trackWidth], {
      ease: "linear",
      duration: 35,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0,
    });

    return () => {
      controlsRef.current?.stop();
    };
  }, [x, trackWidth]);

  // Hover & Focus Overrides
  const handleMouseEnter = () => {
    controlsRef.current?.pause();
  };

  const handleMouseLeave = () => {
    controlsRef.current?.play();
  };

  const handleFocus = () => {
    controlsRef.current?.pause();
  };

  const handleBlur = () => {
    controlsRef.current?.play();
  };

  return (
    <section 
      aria-labelledby="testimonials-section-title" 
      className="py-section-sm overflow-hidden bg-background"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[#0A5C5C]">
            Testimonials
          </p>
          <h2 id="testimonials-section-title" className="mt-3 text-3xl font-bold tracking-tight text-[#0F1717]">
            What Our Patients Say
          </h2>
          <p className="mt-4 text-base text-[#0F1717]/70 leading-relaxed">
            Real feedback from patients who experienced our calm, professional care.
          </p>
        </div>
      </div>

      {/* Marquee Track Wrapper */}
      <div 
        className="relative w-full overflow-hidden select-none py-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocusCapture={handleFocus}
        onBlurCapture={handleBlur}
      >
        {/* Fading gradient edges for premium aesthetic */}
        <div className="absolute inset-y-0 left-0 z-10 w-12 sm:w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 z-10 w-12 sm:w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <motion.div
          ref={trackRef}
          className="flex gap-6 w-max px-6"
          style={{ x: mounted ? x : 0 }}
        >
          {doubledTestimonials.map((testimonial, idx) => (
            <article
              key={`${testimonial.id}-${idx}`}
              // Accessibility Compliance: tabIndex={0} and proper outlines
              tabIndex={0}
              className="flex h-full w-[22rem] shrink-0 flex-col justify-between rounded-none border border-[#0F1717]/5 bg-white p-7 shadow-none transition-all duration-[var(--duration-base)] hover:border-[#0A5C5C]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A5C5C] focus-visible:border-[#0A5C5C]/35 cursor-grab active:cursor-grabbing"
              aria-label={`Testimonial from ${testimonial.name} for ${testimonial.treatment}`}
            >
              <div>
                <div className="flex items-center gap-1" aria-label={`Rating: ${testimonial.rating} stars`}>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-[#0A5C5C] text-[#0A5C5C]" strokeWidth={2} />
                  ))}
                </div>
                <p className="mt-5 text-sm leading-relaxed text-[#0F1717]/90 whitespace-normal">
                  &ldquo;{testimonial.review}&rdquo;
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3.5 border-t border-[#0F1717]/5 pt-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0A5C5C]/10 text-sm font-semibold text-[#0A5C5C]">
                  {testimonial.avatarLetter}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F1717]">{testimonial.name}</h3>
                  <p className="text-xs text-[#0F1717]/60">{testimonial.treatment}</p>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
