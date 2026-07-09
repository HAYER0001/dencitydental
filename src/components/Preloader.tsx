"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function Preloader() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [dissolve, setDissolve] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Draw settles → dissolve the smile → slide the whole curtain away.
    const dissolveAt = reduceMotion ? 500 : 1650;
    const hideAt = reduceMotion ? 900 : 2200;

    const t1 = setTimeout(() => setDissolve(true), dissolveAt);
    const t2 = setTimeout(() => setShowPreloader(false), hideAt);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {showPreloader && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-deep-charcoal"
        >
          <motion.svg
            width="200"
            height="150"
            viewBox="0 0 200 150"
            fill="none"
            aria-hidden
            animate={{ opacity: dissolve ? 0 : 1, scale: dissolve ? 1.08 : 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Minimalist smile — drawn with spring physics for an organic settle. */}
            <motion.path
              d="M35 70 Q100 145 165 70"
              stroke="#ffffff"
              strokeWidth={9}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: reduceMotion ? 1 : [0, 1] }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 42, damping: 13, mass: 1 }
              }
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
