"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const greetings = ["Olá", "Hallo", "Hello", "やあ"];

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    if (index < greetings.length - 1) {
      const timer = setTimeout(() => {
        setIndex(index + 1);
      }, 300); // Adjust speed of text cycle
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 800); // Pause on the last greeting before sliding up
      return () => clearTimeout(timer);
    }
  }, [index]);

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
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-4xl md:text-6xl font-serif text-white font-medium tracking-wide"
              >
                {greetings[index]}
              </motion.h1>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
