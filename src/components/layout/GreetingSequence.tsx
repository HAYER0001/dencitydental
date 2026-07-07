"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const words = ["Hello", "Olá", "Hallo", "Namaste"];

export default function GreetingSequence() {
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);
  const [isWiping, setIsWiping] = useState(false);
  const reduceMotion = useReducedMotion();

  // 4. SSR Safety: Check sessionStorage to ensure it runs only once per user session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("greeting-seen");
      // If reduced motion is preferred, we skip the splash screen to respect user preference
      if (!seen && !reduceMotion) {
        setShow(true);
      }
    }
  }, [reduceMotion]);

  // Disable body scroll when splash is active
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  // 1. Logic: Iterate through strings sequentially
  useEffect(() => {
    if (!show) return;

    let timer1 = setTimeout(() => setIndex(1), 900);
    let timer2 = setTimeout(() => setIndex(2), 1800);
    let timer3 = setTimeout(() => setIndex(3), 2700);
    
    // 3. Exit: Wipe transition after the final word
    let timer4 = setTimeout(() => setIsWiping(true), 3600);
    
    // Tear down component overlay
    let timer5 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("greeting-seen", "true");
    }, 4400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={isWiping ? { clipPath: "inset(0% 0% 100% 0%)" } : { clipPath: "inset(0% 0% 0% 0%)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0F1717]"
      aria-hidden="true"
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          {/* 2. Animation: letter spacing (tracking) and blur text transition */}
          <motion.h1
            key={words[index]}
            initial={{ opacity: 0, letterSpacing: "-0.05em", filter: "blur(8px)" }}
            animate={{ opacity: 1, letterSpacing: "0.15em", filter: "blur(0px)" }}
            exit={{ opacity: 0, letterSpacing: "0.25em", filter: "blur(8px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider text-white select-none"
          >
            {words[index]}
          </motion.h1>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
