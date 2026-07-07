"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface ScrambleTextProps {
  text: string;
  duration?: number;
  delay?: number;
  className?: string;
}

export default function ScrambleText({ text, duration = 300, delay = 0, className = "" }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || reduceMotion) return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*?@";
    const intervalTime = 20; // 20ms steps
    const totalFrames = Math.max(1, Math.floor(duration / intervalTime));
    let frame = 0;
    let interval: NodeJS.Timeout;

    const runScramble = () => {
      interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (char === " " || char === "\n" || char === "-" || char === ".") return char;
              const progress = frame / totalFrames;
              if (index / text.length < progress) {
                return char;
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );
        frame++;
        if (frame > totalFrames) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, intervalTime);
    };

    let timeoutId: NodeJS.Timeout;
    if (delay > 0) {
      timeoutId = setTimeout(runScramble, delay);
    } else {
      runScramble();
    }

    return () => {
      clearTimeout(timeoutId);
      if (interval) clearInterval(interval);
    };
  }, [text, duration, delay, mounted, reduceMotion]);

  return (
    <span className={className}>
      {displayText}
    </span>
  );
}
