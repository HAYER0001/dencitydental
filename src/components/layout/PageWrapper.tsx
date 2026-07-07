"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR Safety: Render children statically when not mounted or when reduced motion is preferred
  if (!mounted || reduceMotion) {
    return <div className="flex flex-1 flex-col">{children}</div>;
  }

  return (
    // 1. Wrapper: motion.div with opacity 0, y 20 -> opacity 1, y 0
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // 2. Transitions: duration 0.6 and premium cubic-bezier easing
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
