//@ts-nocheck
"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "motion/react";
import { FC, useRef } from "react";

interface ScrollTextRevealProps {
  children: string;
  className?: string;
  blurStrength?: number;
  revealSpeed?: 'slow' | 'medium' | 'fast';
  enableFadeOut?: boolean;
}

const Word: FC<{
  word: string;
  i: number;
  totalWords: number;
  scrollYProgress: any;
  startDelay: number;
  wordSpacing: number;
  fadeOutStart: number;
  enableFadeOut: boolean;
  blurStrength: number;
}> = ({ word, i, totalWords, scrollYProgress, startDelay, wordSpacing, fadeOutStart, enableFadeOut, blurStrength }) => {
  const wordProgress = i / totalWords;

  // ✅ Reveal phase
  const revealStart = startDelay + (wordProgress * wordSpacing);
  const revealEnd = revealStart + (wordSpacing / totalWords) * 6;

  // ✅ Fade-out phase - začína neskôr
  const fadeOutStartPoint = fadeOutStart + (wordProgress * 0.2);
  const fadeOutEnd = fadeOutStartPoint + 0.15;

  // Reveal opacity (0 -> 1)
  const revealOpacity = useTransform(
    scrollYProgress,
    [revealStart, revealEnd],
    [0, 1]
  );

  // Fade-out opacity (1 -> 0) - len ak je enableFadeOut
  const fadeOutOpacity = useTransform(
    scrollYProgress,
    [fadeOutStartPoint, fadeOutEnd],
    enableFadeOut ? [1, 0] : [1, 1]
  );

  // Kombinovaná opacity
  const finalOpacity = useTransform(
    scrollYProgress,
    (progress) => {
      const reveal = revealOpacity.get();
      const fadeOut = fadeOutOpacity.get();
      return Math.min(reveal, fadeOut);
    }
  );

  // Blur pre neodhalený text
  const blurOpacity = useTransform(
    scrollYProgress,
    [revealStart, revealEnd],
    [1, 0]
  );

  // Blur pre fade-out
  const fadeOutBlur = useTransform(
    scrollYProgress,
    [fadeOutStartPoint, fadeOutEnd],
    enableFadeOut ? [0, blurStrength] : [0, 0]
  );

  return (
    <span className="relative inline-block mx-1">
      {/* Blur text - pre reveal */}
      <motion.span
        style={{
          opacity: blurOpacity,
          filter: `blur(${blurStrength}px)`,
        }}
        className="absolute inset-0 text-gray-400 dark:text-gray-600 select-none"
        aria-hidden="true"
      >
        {word}
      </motion.span>

      {/* Sharp text s fade-out */}
      <motion.span
        style={{
          opacity: finalOpacity,
          filter: `blur(${fadeOutBlur.get()}px)`
        }}
        className="relative text-foreground"
      >
        {word}
      </motion.span>
    </span>
  );
};

export const ScrollTextReveal: FC<ScrollTextRevealProps> = ({
  children,
  className = "",
  blurStrength = 6,
  revealSpeed = 'slow',
  enableFadeOut = true
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 90%", "end 10%"],
  });

  const words = children.split(" ");

  const speedSettings = {
    slow: { startDelay: 0.1, endDelay: 0.8, wordSpacing: 0.6, fadeOutStart: 0.7 },
    medium: { startDelay: 0.2, endDelay: 0.7, wordSpacing: 0.4, fadeOutStart: 0.6 },
    fast: { startDelay: 0.3, endDelay: 0.6, wordSpacing: 0.2, fadeOutStart: 0.5 }
  };

  const { startDelay, wordSpacing, fadeOutStart } = speedSettings[revealSpeed];

  return (
    <div
      ref={targetRef}
      className={cn("relative py-8", className)}
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-lg leading-relaxed md:text-xl lg:text-2xl">
          {words.map((word, i) => (
            <Word
              key={i}
              word={word}
              i={i}
              totalWords={words.length}
              scrollYProgress={scrollYProgress}
              startDelay={startDelay}
              wordSpacing={wordSpacing}
              fadeOutStart={fadeOutStart}
              enableFadeOut={enableFadeOut}
              blurStrength={blurStrength}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
