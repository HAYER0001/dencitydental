"use client";

import { useEffect } from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

export type AntiGravityOptions = {
  /** Peak vertical travel from centre, in px. The element drifts between -amplitude and +amplitude. */
  amplitude?: number;
  /** Spring stiffness — keep it low for a heavy, unhurried drift. */
  stiffness?: number;
  /** Spring damping — keep it high (near or above critical) so the motion never bounces or feels jerky. */
  damping?: number;
  /** Spring mass — higher reads as weightier, more "expensive". */
  mass?: number;
  /** Seconds to offset the start, used to desync neighbouring elements so they never move in lockstep. */
  delay?: number;
  /** When false (reduced-motion, or an element is expanded/focused) the float eases to rest and holds. */
  enabled?: boolean;
};

/**
 * "Anti-gravity": a permanent, spring-driven vertical float.
 *
 * Returns a `MotionValue<number>` you drop straight onto `style={{ y }}`. Real
 * spring physics — a near-critically-damped, low-stiffness, high-mass spring
 * oscillating between -amplitude and +amplitude — so the drift feels heavy and
 * weightless rather than a linear keyframe loop.
 *
 * It only ever writes the `y` transform: it never touches pointer events,
 * layout, or any other axis, so it cannot interfere with clicks, links, or form
 * inputs. Under `prefers-reduced-motion` (or `enabled: false`) it eases to 0 and
 * stays there.
 */
export function useAntiGravity({
  amplitude = 12,
  stiffness = 22,
  damping = 12,
  mass = 1.4,
  delay = 0,
  enabled = true,
}: AntiGravityOptions = {}): MotionValue<number> {
  const reduceMotion = useReducedMotion();
  const y = useMotionValue(0);

  useEffect(() => {
    const active = enabled && !reduceMotion && amplitude > 0;

    if (!active) {
      // Ease gently back to rest rather than snapping — settling is part of the polish.
      const settle = animate(y, 0, { type: "spring", stiffness, damping, mass });
      return () => settle.stop();
    }

    y.set(-amplitude);
    const controls = animate(y, amplitude, {
      type: "spring",
      stiffness,
      damping,
      mass,
      delay,
      repeat: Infinity,
      repeatType: "reverse",
    });

    return () => controls.stop();
  }, [enabled, reduceMotion, amplitude, stiffness, damping, mass, delay, y]);

  return y;
}
