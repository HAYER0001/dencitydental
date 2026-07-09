"use client";

import { useEffect, type RefObject } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";

/** All clinic photos in public/gallery (living-room.JPG stays the ambient backdrop). */
const PHOTOS = [
  "009a68aa-9a18-4907-bf9b-bb0facd4994f",
  "02f53ab5-63c9-450a-bd92-57c029ccf6f3",
  "0e058398-df52-4405-8d8b-b9355d051069",
  "1d5128c9-ca1c-4322-9e92-f0c7823c6a30",
  "1e0796f9-df94-44de-a575-92dd349a9d6c",
  "1fe33487-a1bb-4712-bb2b-e644b609977a",
  "3abc1052-7cdf-4520-8505-c9cdf1d99abe",
  "405c144b-81af-43f2-a6f9-8abd3a8a5d22",
  "5a06090c-7ff1-4741-b0d6-e70e7e8ed204",
  "90e66f25-9065-474c-af84-09b1b2ed5757",
  "936ba408-e7a1-4104-9b04-06cae3a39b69",
  "b9e8c65f-6b58-4534-b819-2f0ff4fd2903",
  "bdea75e0-baab-4f7e-9d63-a1504f0959e9",
  "cd53b6b0-db26-4f2e-a03e-1d39fcf41834",
  "f0f6e269-98b4-40bb-8357-ebf099982819",
  "f6b6e929-47ee-49fb-9bc6-02b1e700b73a",
].map((id) => `/gallery/${id}.JPG`);

/**
 * Deterministic 3D layout: photos flank the centre (leaving the middle clear for
 * the typography) and recede into depth. Distant frames are dimmer, blurrier and
 * smaller — baked depth-of-field so the field reads as an expensive, cinematic
 * corridor rather than a flat collage.
 */
const RINGS = Math.ceil(PHOTOS.length / 2);
const LAYOUT = PHOTOS.map((src, i) => {
  const side = i % 2 === 0 ? -1 : 1;
  const ring = Math.floor(i / 2); // 0..RINGS-1, deeper as it grows
  const depthT = ring / (RINGS - 1); // 0 (near) .. 1 (far)

  // Pseudo-random but stable vertical scatter.
  const y = (((i * 137) % 100) / 100 - 0.5) * 44; // vh, -22..22

  return {
    src,
    x: side * (25 + ring * 3.4), // vw — spread wider with depth
    y,
    z: -140 - ring * 250, // px — recede into the screen
    rotateY: side * -20, // angle frames toward the centre
    rotateX: ((i % 3) - 1) * 4,
    scale: 1 - depthT * 0.18,
    opacity: 0.82 - depthT * 0.52, // near bright, far faint
    blur: depthT * 3.6, // near sharp, far soft
    width: 20 - depthT * 4, // vw
  };
});

/** Heavy, unhurried springs — the motion should feel weighty and expensive. */
const TILT_SPRING = { stiffness: 35, damping: 20, mass: 1.6 } as const;
const DOLLY_SPRING = { stiffness: 26, damping: 24, mass: 1.9 } as const;

export default function HeroGallery3D({
  scrollTargetRef,
}: {
  scrollTargetRef: RefObject<HTMLDivElement | null>;
}) {
  const reduceMotion = useReducedMotion();

  // Mouse-driven parallax: normalised -0.5..0.5 around the viewport centre.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [9, -9]), TILT_SPRING);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [-6, 6]), TILT_SPRING);
  const shiftX = useSpring(useTransform(pointerX, [-0.5, 0.5], [34, -34]), TILT_SPRING);
  const shiftY = useSpring(useTransform(pointerY, [-0.5, 0.5], [22, -22]), TILT_SPRING);

  // Scroll dolly: fly forward through the corridor across the pinned hero.
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start start", "end end"],
  });
  const dollyZ = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1350]), DOLLY_SPRING);
  const driftRotateY = useTransform(scrollYProgress, [0, 1], [0, -10]);

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: MouseEvent) => {
      pointerX.set(e.clientX / window.innerWidth - 0.5);
      pointerY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion, pointerX, pointerY]);

  // Motion applies only when allowed; reduced-motion renders the field at rest.
  const stageStyle: MotionStyle = reduceMotion
    ? { transformStyle: "preserve-3d" }
    : { transformStyle: "preserve-3d", rotateX, rotateY, x: shiftX, y: shiftY, z: dollyZ, rotate: driftRotateY };

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-[3] overflow-hidden pointer-events-none"
      style={{ perspective: "1300px", perspectiveOrigin: "50% 45%" }}
    >
      <motion.div className="absolute inset-0" style={stageStyle}>
        {/* Idle float — the whole field breathes even when the user is still. */}
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
          animate={reduceMotion ? undefined : { rotateY: [-3, 3, -3], y: [0, -12, 0] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 18, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {LAYOUT.map((it) => (
            <div
              key={it.src}
              className="absolute inset-0 grid place-items-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10"
                style={{
                  width: `${it.width}vw`,
                  maxWidth: 300,
                  minWidth: 150,
                  opacity: it.opacity,
                  filter: `blur(${it.blur}px)`,
                  transform: `translate3d(${it.x}vw, ${it.y}vh, ${it.z}px) rotateY(${it.rotateY}deg) rotateX(${it.rotateX}deg) scale(${it.scale})`,
                }}
              >
                <Image
                  src={it.src}
                  alt=""
                  fill
                  sizes="25vw"
                  quality={70}
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Vignette: frames the corridor and keeps the centred typography legible. */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 32%, #0F1717 90%)" }}
      />
    </div>
  );
}
