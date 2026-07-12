"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

import { easings, fadeUp, stagger } from "@/lib/motion";
import Container from "@/components/layout/Container";

export type StatItem = {
  /** Number the counter animates to. */
  value: number;
  /** Rendered directly after the number, e.g. "+", "K+", "%", "/7". */
  suffix?: string;
  label: string;
};

const defaultStats: StatItem[] = [
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 20, suffix: "K+", label: "Patients Treated" },
  { value: 98, suffix: "%", label: "Patient Satisfaction" },
  { value: 24, suffix: "/7", label: "Emergency Care" },
];

export function CountUp({
  value,
  suffix = "",
  duration = 1.4,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  // The server renders the final value; the counter only rewinds to 0
  // once the element is actually in view on the client.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration,
      ease: easings.outExpo,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function Stats({ stats = defaultStats }: { stats?: StatItem[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="stats-heading"
      className="border-y border-deep-charcoal/5 bg-surface/60 dark:border-white/5"
    >
      <h2 id="stats-heading" className="sr-only">
        DENCITY in numbers
      </h2>
      <Container className="py-section-sm">
        <motion.dl
          variants={stagger}
          initial={reduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="flex flex-col items-center gap-2 text-center"
            >
              <dt className="order-2 text-body-sm text-muted">{stat.label}</dt>
              <dd className="order-1 text-heading-1 tabular-nums text-clinic-teal dark:text-clinic-teal-soft">
                <span className="sr-only">
                  {stat.value}
                  {stat.suffix}
                </span>
                <span aria-hidden="true">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </span>
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </Container>
    </section>
  );
}
