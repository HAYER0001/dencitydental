"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// Core routes that warrant a transition reveal
const transitionRoutes = ["/", "/services", "/book", "/about", "/contact", "/sign-in"];

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMounted(true);
    }
  }, []);

  // 3. State: Reset scroll position to top 0 on transition complete
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname, mounted]);

  if (!mounted) {
    return <div className="flex flex-1 flex-col">{children}</div>;
  }

  // 4. SSR Safety: Conditional route checks
  const isTransitionRoute = transitionRoutes.includes(pathname);

  // If the route is a transition route and reduced motion is NOT requested, trigger AnimatePresence
  // By using the pathname as key only for transition routes, we isolate transitions to relevant pages.
  const animationKey = isTransitionRoute && !reduceMotion ? pathname : "static-route";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey}
        className="flex flex-1 flex-col relative"
      >
        {/* If it's a transition route and reduced motion is NOT requested, trigger Fade-to-Fog */}
        {isTransitionRoute && !reduceMotion && (
          <>
            {/* Exit Fog Layer (fades in as page exits) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] } as const}
              className="fixed inset-0 z-[80] bg-[#E6E4E1] pointer-events-none"
            />
            {/* Entry Fog Layer (fades out as new page enters) */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 } as const}
              className="fixed inset-0 z-[80] bg-[#E6E4E1] pointer-events-none"
            />
          </>
        )}

        {/* Page Content Animation (fades in slightly on route load) */}
        <motion.div
          initial={isTransitionRoute && !reduceMotion ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={isTransitionRoute && !reduceMotion ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-1 flex-col"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
