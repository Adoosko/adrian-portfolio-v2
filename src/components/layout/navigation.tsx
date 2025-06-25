//@ts-nocheck
"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { useAnimationStore } from "@/stores/animation-store";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Download, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import LanguageSwitcher from "../LanguageSwitcher";

interface NavigationProps {
  data: {
    about: string;
    work: string;
    contact: string;
    resume: string;
    download_resume: string;
  };
}

// Pokročilé easing funkcie pre 2025[7]
const customEasing = {
  dramatic: [0.22, 1, 0.36, 1],
  elastic: [0.175, 0.885, 0.32, 1.275],
  smooth: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.68, -0.55, 0.265, 1.55],
  spring: { type: "spring", stiffness: 300, damping: 30 },
};

export function Navigation({ data }: NavigationProps) {
  const navItems = [
    { name: data.about, href: "#about", index: "01" },
    { name: data.work, href: "#work", index: "02" },
    { name: data.contact, href: "#contact", index: "03" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredPath, setHoveredPath] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const animateHero = useAnimationStore((state) => state.animateHero);

  // Advanced motion values pre smooth interactions[7]
  const scrollProgress = useMotionValue(0);
  const smoothScrollProgress = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
  });

  const navOpacity = useTransform(smoothScrollProgress, [0, 50], [0.95, 1]);
  const navBlur = useTransform(smoothScrollProgress, [0, 50], [8, 20]);
  const navScale = useTransform(smoothScrollProgress, [0, 50], [0.98, 1]);

  // Mouse tracking pre advanced interactions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // Advanced scroll detection s performance optimalizáciou[4]
  useMotionValueEvent(scrollY, "change", (latest) => {
    scrollProgress.set(latest);
    setIsScrolled(latest > 50);
  });

  // Intelligent active section detection[2]
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href.substring(1));
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(`#${currentSection}`);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  // Advanced mouse tracking pre 3D efekty
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!navRef.current) return;

    const rect = navRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (event.clientX - centerX) / rect.width;
    const y = (event.clientY - centerY) / rect.height;

    mouseX.set(x * 10);
    mouseY.set(y * 5);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMobileMenuOpen(false);
  };

  // Orchestrované animácie pre navigation reveal[7]
  const navVariants = {
    hidden: {
      y: -100,
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: customEasing.dramatic,
        staggerChildren: 0.1,
        delayChildren: 0,
      },
    },
  };

  // Advanced logo animácie
  const logoVariants = {
    rest: { scale: 1, rotateY: 0 },
    hover: {
      scale: 1.05,
      rotateY: 5,
      transition: {
        duration: 0.4,
        ease: customEasing.elastic,
      },
    },
    tap: {
      scale: 0.95,
      rotateY: -5,
      transition: { duration: 0.1 },
    },
  };

  // Pokročilé nav item animácie s stagger efektom[6]
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      filter: "blur(5px)",
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        delay: 0.3 + index * 0.1,
        ease: customEasing.bounce,
      },
    }),
  };

  // Advanced mobile menu animácie
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.4,
        ease: customEasing.smooth,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: customEasing.smooth,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    closed: {
      x: -30,
      opacity: 0,
      scale: 0.95,
      filter: "blur(3px)",
    },
    open: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: customEasing.elastic,
      },
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <motion.nav
        ref={navRef}
        variants={navVariants}
        initial="hidden"
        animate={animateHero ? "visible" : "hidden"}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
        className={`fixed top-0 w-full z-50 transition-all duration-700 ease-out ${
          isScrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-lg"
            : "bg-transparent"
        }`}
        style={{
          opacity: navOpacity,
          scale: navScale,
          backdropFilter: `blur(${navBlur}px)`,
          perspective: "1000px",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Advanced Logo s 3D efektmi */}
            <motion.div
              variants={itemVariants}
              custom={0}
              whileHover="hover"
              whileTap="tap"
              initial="rest"
            >
              <motion.button
                variants={logoVariants}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="relative group"
                style={{
                  rotateX: smoothMouseY,
                  rotateY: smoothMouseX,
                  transformStyle: "preserve-3d",
                }}
              >
                <motion.span
                  className="text-xl lg:text-2xl font-mono font-semibold tracking-tight text-foreground relative z-10"
                >
                  AF
                </motion.span>

                {/* Advanced underline s gradient */}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-foreground origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: customEasing.smooth }}
                />

                {/* Glow efekt */}
                <motion.div
                  className="absolute inset-0 bg-foreground/10 rounded-lg blur-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>

            {/* Desktop Navigation s pokročilými efektmi */}
            <div className="hidden lg:flex items-center space-x-1">
              <motion.div
                className="flex items-center space-x-1 relative bg-muted/50 rounded-xl p-1.5 border border-border/50 backdrop-blur-sm"
                style={{
                  rotateX: smoothMouseY,
                  rotateY: smoothMouseX,
                }}
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    variants={itemVariants}
                    custom={index + 1}
                    className="relative"
                  >
                    <motion.button
                      onClick={() => scrollToSection(item.href)}
                      onMouseEnter={() => setHoveredPath(item.href)}
                      onMouseLeave={() => setHoveredPath("")}
                      className={`relative z-10 flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg ${
                        activeSection === item.href
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      whileHover={{
                        scale: 1.02,
                        y: -1,
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={customEasing.spring}
                    >
                      <motion.span
                        className="font-mono text-xs text-muted-foreground"
                        animate={{
                          color:
                            hoveredPath === item.href ? "hsl(var(--foreground))" : undefined,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.index}
                      </motion.span>
                      <span className="tracking-wide">{item.name}</span>

                      {/* Micro-interaction arrow */}
                      <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{
                          x: hoveredPath === item.href ? 0 : -10,
                          opacity: hoveredPath === item.href ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.2,
                          ease: customEasing.smooth,
                        }}
                      >
                        <ArrowRight className="w-3 h-3" />
                      </motion.div>
                    </motion.button>

                    {/* Advanced hover background s morphing */}
                    <AnimatePresence>
                      {(hoveredPath === item.href ||
                        activeSection === item.href) && (
                        <motion.div
                          layoutId="navbar-hover"
                          className="absolute inset-0 bg-muted rounded-lg"
                          initial={{
                            opacity: 0,
                            scale: 0.8,
                            filter: "blur(4px)",
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            filter: "blur(0px)",
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.8,
                            filter: "blur(4px)",
                          }}
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>

              {/* Desktop Actions s pokročilými animáciami */}
              <motion.div
                variants={itemVariants}
                custom={4}
                className="flex items-center space-x-4 ml-6"
              >
                <ThemeToggle />
                <LanguageSwitcher />

                <motion.a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    scale: 1.02,
                    y: -2,
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-4 py-2.5 text-sm font-medium border border-border text-foreground rounded-lg hover:bg-muted transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>{data.resume}</span>
                  </span>

                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-muted"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              </motion.div>
            </div>

            {/* Mobile Menu Button s pokročilými animáciami */}
            <div className="lg:hidden flex items-center space-x-3">
              <LanguageSwitcher></LanguageSwitcher>
              <ThemeToggle />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative p-2 rounded-lg text-foreground hover:bg-muted transition-colors z-50 overflow-hidden"
                aria-label="Toggle mobile menu"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-muted"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />

                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
                    >
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
                    >
                      <Menu size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Advanced Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden overflow-hidden"
            >
              <motion.div
                className="bg-background/95 backdrop-blur-xl border-t border-border shadow-2xl"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 py-8 space-y-6">
                  {/* Mobile Navigation Items s stagger efektom */}
                  <div className="space-y-4">
                    {navItems.map((item, index) => (
                      <motion.div key={item.name} variants={mobileItemVariants}>
                        <motion.button
                          onClick={() => scrollToSection(item.href)}
                          className="flex items-center space-x-4 w-full text-left group py-3 px-4 rounded-lg hover:bg-muted transition-colors relative overflow-hidden"
                          whileHover={{ x: 4, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={customEasing.spring}
                        >
                          {/* Hover background */}
                          <motion.div
                            className="absolute inset-0 bg-muted"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                          />

                          <span className="font-mono text-sm text-muted-foreground w-8 relative z-10">
                            {item.index}
                          </span>
                          <span className="text-xl font-medium tracking-wide text-foreground relative z-10">
                            {item.name}
                          </span>

                          <motion.div
                            className="ml-auto relative z-10"
                            initial={{ x: -10, opacity: 0 }}
                            whileHover={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="w-5 h-5 text-muted-foreground" />
                          </motion.div>
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mobile Resume Button s pokročilými efektmi */}
                  <motion.div
                    variants={mobileItemVariants}
                    className="pt-6 border-t border-border"
                  >
                    <motion.a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center w-full px-6 py-4 text-sm font-medium text-center border border-border text-foreground bg-background rounded-lg hover:bg-muted transition-all duration-300 relative overflow-hidden group"
                    >
                      {/* Animated background */}
                      <motion.div
                        className="absolute inset-0 bg-muted"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />

                      <span className="relative z-10 flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>{data.download_resume}</span>
                      </span>

                      <motion.span
                        className="ml-2 relative z-10"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </motion.a>
                  </motion.div>

                  {/* Mobile Footer Info */}
                  <motion.div
                    variants={mobileItemVariants}
                    className="pt-6 border-t border-border text-center"
                  >
                    <motion.p
                      className="text-xs text-muted-foreground font-mono"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      Built with Next.js & Framer Motion
                    </motion.p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Advanced Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
