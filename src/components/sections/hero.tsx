"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
interface HeroProps {
  data: {
    greeting: string;
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    cta2Text: string;
    roles: string[];
  };
}

/* ─────────────────────────────────────────────
   Magnetic Button wrapper — CTA feels alive
   ───────────────────────────────────────────── */
function MagneticWrap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.PointerEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Role cycler — text rotates with blur + slide
   ───────────────────────────────────────────── */
function RoleCycler({ roles }: { roles: string[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % roles.length), 3000);
    return () => clearInterval(id);
  }, [roles.length]);

  return (
    <span className="hero-role-cycler inline-flex relative overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[idx]}
          initial={{ y: "110%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-110%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {roles[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ─────────────────────────────────────────────
   Character stagger — each letter animates in
   ───────────────────────────────────────────── */
function StaggerChars({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <span
      className={`inline-flex flex-wrap justify-center ${className}`}
      aria-label={text}
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block hero-char"
          style={{ willChange: "transform, opacity" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Floating background labels
   ───────────────────────────────────────────── */
const floatingWords = [
  {
    text: "Next.js",
    x: "8%",
    y: "18%",
    size: "text-xs sm:text-sm",
    rotate: -12,
  },
  {
    text: "TypeScript",
    x: "85%",
    y: "22%",
    size: "text-xs sm:text-sm",
    rotate: 8,
  },
  { text: "React", x: "12%", y: "72%", size: "text-xs sm:text-sm", rotate: 6 },
  {
    text: "Design",
    x: "88%",
    y: "75%",
    size: "text-xs sm:text-sm",
    rotate: -10,
  },
  {
    text: "<code />",
    x: "75%",
    y: "12%",
    size: "text-[10px] sm:text-xs font-mono",
    rotate: 15,
  },
  {
    text: "UI/UX",
    x: "20%",
    y: "85%",
    size: "text-[10px] sm:text-xs",
    rotate: -5,
  },
];

function FloatingLabels({ scrollY }: { scrollY: MotionValue<number> }) {
  return (
    <>
      {floatingWords.map((w, i) => {
        const yOffset = useTransform(
          scrollY,
          [0, 800],
          [0, i % 2 === 0 ? -60 : 60]
        );
        const springY = useSpring(yOffset, { stiffness: 40, damping: 20 });
        return (
          <motion.span
            key={w.text}
            className={`pointer-events-none absolute select-none ${w.size} tracking-widest uppercase text-foreground/[0.04] dark:text-foreground/[0.06] hidden sm:block`}
            style={{
              left: w.x,
              top: w.y,
              rotate: w.rotate,
              y: springY,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 + i * 0.15, duration: 0.8 }}
          >
            {w.text}
          </motion.span>
        );
      })}
    </>
  );
}

/* ─────────────────────────────────────────────
   Orbital ring — SVG ring that rotates slowly
   ───────────────────────────────────────────── */
function OrbitalRing() {
  return (
    <motion.div
      className="hero-orbital pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden lg:block"
      style={{ x: "-50%", y: "-50%" }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <svg
        width="700"
        height="700"
        viewBox="0 0 700 700"
        fill="none"
        className="hero-orbit-svg"
      >
        {/* Outer dashed ring */}
        <circle
          cx="350"
          cy="350"
          r="340"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="4 12"
          className="text-foreground/[0.06] dark:text-foreground/[0.08]"
        />
        {/* Inner thin ring */}
        <circle
          cx="350"
          cy="350"
          r="280"
          stroke="currentColor"
          strokeWidth="0.3"
          className="text-foreground/[0.04] dark:text-foreground/[0.06]"
        />
        {/* Dot on orbit */}
        <circle
          cx="350"
          cy="10"
          r="3"
          className="fill-foreground/10 hero-orbit-dot"
        />
        <circle
          cx="690"
          cy="350"
          r="2"
          className="fill-foreground/10 hero-orbit-dot-2"
        />
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Noise overlay — adds texture
   ───────────────────────────────────────────── */
function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 opacity-[0.018] dark:opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   Main Hero
   ───────────────────────────────────────────── */
export default function Hero({ data }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Scroll progress for parallax
  const { scrollY } = useScroll();

  // Cursor-following gradient
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const sX = useSpring(pointerX, { stiffness: 50, damping: 25 });
  const sY = useSpring(pointerY, { stiffness: 50, damping: 25 });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      pointerX.set((e.clientX - rect.left) / rect.width);
      pointerY.set((e.clientY - rect.top) / rect.height);
    },
    [pointerX, pointerY]
  );

  // Morphing gradient background
  const gradX = useTransform(sX, (v) => `${v * 100}%`);
  const gradY = useTransform(sY, (v) => `${v * 100}%`);

  // Parallax on content
  const contentY = useTransform(scrollY, [0, 600], [0, 80]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ── entrance timeline ── */
  const stagger = {
    badge: 0.15,
    name: 0.35,
    line: 0.9,
    subtitle: 1.0,
    desc: 1.15,
    cta: 1.3,
    extras: 1.6,
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="hero-section relative flex min-h-[100dvh] items-center justify-center overflow-hidden"
    >
      {/* ── Layers ── */}
      <NoiseOverlay />
      <FloatingLabels scrollY={scrollY} />
      <OrbitalRing />

      {/* ── Cursor-reactive gradient blob ── */}
      <motion.div
        className="pointer-events-none absolute -z-10 h-[min(80vw,700px)] w-[min(80vw,700px)] rounded-full"
        style={{
          left: gradX,
          top: gradY,
          x: "-50%",
          y: "-50%",
          background:
            "radial-gradient(circle, hsl(var(--foreground) / 0.025) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Cross-hairs / corner decorations ── */}
      <div className="pointer-events-none absolute inset-6 sm:inset-10 -z-10 hidden sm:block">
        {/* Top-left */}
        <span className="absolute left-0 top-0 h-8 w-px bg-foreground/[0.06]" />
        <span className="absolute left-0 top-0 h-px w-8 bg-foreground/[0.06]" />
        {/* Top-right */}
        <span className="absolute right-0 top-0 h-8 w-px bg-foreground/[0.06]" />
        <span className="absolute right-0 top-0 h-px w-8 bg-foreground/[0.06]" />
        {/* Bottom-left */}
        <span className="absolute bottom-0 left-0 h-8 w-px bg-foreground/[0.06]" />
        <span className="absolute bottom-0 left-0 h-px w-8 bg-foreground/[0.06]" />
        {/* Bottom-right */}
        <span className="absolute bottom-0 right-0 h-8 w-px bg-foreground/[0.06]" />
        <span className="absolute bottom-0 right-0 h-px w-8 bg-foreground/[0.06]" />
      </div>

      {/* ── Thin horizontal rules ── */}
      <motion.span
        className="pointer-events-none absolute left-0 right-0 top-[30%] h-px bg-foreground/[0.03] hidden lg:block"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0 }}
      />
      <motion.span
        className="pointer-events-none absolute left-0 right-0 bottom-[30%] h-px bg-foreground/[0.03] hidden lg:block"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 1 }}
      />

      {/* ── Main Content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: stagger.badge,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-10"
        >
          <span className="hero-badge inline-flex items-center gap-2.5 rounded-full border border-foreground/10 bg-foreground/[0.02] px-5 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/80 dark:bg-emerald-400/80" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            </span>
            {data.greeting}
          </span>
        </motion.div>

        {/* Giant Name — character stagger with Boska serif */}
        <div className="hero-name-wrap overflow-hidden">
          <h1 className="hero-name text-[clamp(3rem,10vw,8rem)] font-serif leading-[0.95] tracking-[-0.03em] text-foreground">
            <StaggerChars text={data.title} delay={stagger.name} />
          </h1>
        </div>

        {/* Animated expanding line */}
        <div className="relative my-8 flex w-full items-center justify-center gap-4">
          <motion.span
            className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-foreground/15"
            initial={{ scaleX: 0, originX: 1 }}
            animate={{ scaleX: 1 }}
            transition={{
              delay: stagger.line,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-foreground/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: stagger.line + 0.3,
              duration: 0.4,
              ease: "backOut",
            }}
          />
          <motion.span
            className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-foreground/15"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              delay: stagger.line,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>

        {/* Subtitle with role cycling */}
        <motion.h2
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: stagger.subtitle,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-lg font-light tracking-wide text-muted-foreground sm:text-2xl lg:text-3xl"
        >
          {data.subtitle}{" "}
          <span className="text-foreground font-normal">
            <RoleCycler roles={data.roles} />
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: stagger.desc,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-7 max-w-xl text-sm leading-relaxed text-muted-foreground/80 sm:text-base"
        >
          {data.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: stagger.cta,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticWrap>
            <Button
              onClick={() => scrollToSection("work")}
              size="lg"
              className="hero-btn-primary group relative overflow-hidden bg-foreground text-background hover:bg-foreground/90 px-9 py-6 text-sm font-medium tracking-wide transition-all duration-500"
              aria-label={data.ctaText}
            >
              <span className="relative z-10 flex items-center gap-2">
                {data.ctaText}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              {/* hover sweep */}
              <span className="hero-btn-sweep absolute inset-0 -z-0 translate-x-[-101%] bg-foreground/80 transition-transform duration-500 group-hover:translate-x-0" />
            </Button>
          </MagneticWrap>

          <MagneticWrap>
            <Button
              onClick={() => scrollToSection("contact")}
              variant="outline"
              size="lg"
              className="group border border-foreground/10 text-foreground hover:border-foreground/30 hover:bg-foreground/[0.03] px-9 py-6 text-sm font-medium tracking-wide transition-all duration-500"
              aria-label={data.cta2Text}
            >
              {data.cta2Text}
            </Button>
          </MagneticWrap>
        </motion.div>

        {/* Subtle tech stack line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: stagger.extras, duration: 0.8 }}
          className="mt-16 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/30"
        >
          <span>Next.js</span>
          <span className="h-px w-3 bg-current" />
          <span>TypeScript</span>
          <span className="h-px w-3 bg-current" />
          <span>React</span>
          <span className="h-px w-3 bg-current" />
          <span>Tailwind</span>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.button
        onClick={() => scrollToSection("about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.8 }}
        className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors duration-300 cursor-pointer"
        aria-label="Scroll down"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-medium">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </motion.div>
      </motion.button>

      {/* ── Side vertical text ── */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] uppercase tracking-[0.35em] text-muted-foreground/20 hidden xl:block origin-center whitespace-nowrap"
      >
        Portfolio &mdash; 2026
      </motion.span>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
        className="absolute left-6 top-1/2 -translate-y-1/2 rotate-90 text-[9px] uppercase tracking-[0.35em] text-muted-foreground/20 hidden xl:block origin-center whitespace-nowrap"
      >
        Full-Stack Developer
      </motion.span>
    </section>
  );
}
