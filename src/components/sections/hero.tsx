//@ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { useAnimationStore } from "@/stores/animation-store";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  data: {
    greeting: string;
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    cta2Text: string;
  };
}

// Pokročilé easing patterns
const easings = {
  dramatic: [0.22, 1, 0.36, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  smooth: [0.25, 0.46, 0.45, 0.94],
  elastic: [0.175, 0.885, 0.32, 1.275],
};
export function Hero({ data }: HeroProps) {
  const animateHero = useAnimationStore((state) => state.animateHero);
  // Motion values pre pokročilé interakcie
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring transformácie
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), {
    stiffness: 100,
    damping: 30
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), {
    stiffness: 100,
    damping: 30
  });

  // Orchestrované container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
      },
    },
  };

  // Sofistikované item animácie
  const itemVariants = {
    hidden: {
      y: 60,
      opacity: 0,
      filter: "blur(10px)",
    },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: 0.2 + i * 0.2,
        duration: 1.2,
        ease: easings.dramatic,
      },
    }),
  };

  // Floating sparkles animácia
  const sparkleVariants = {
    hidden: { scale: 0, rotate: 0 },
    visible: {
      scale: [0, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        ease: easings.bounce,
        repeat: Infinity,
        repeatType: "reverse" as const,
        delay: 1,
      },
    },
  };

  // Mouse tracking pre 3D efekt
  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const heroData = data;

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate={animateHero ? "visible" : "hidden"}
      className="min-h-screen flex items-center justify-center px-6 lg:px-20 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      style={{
        perspective: "1000px",
      }}
    >
      {/* Animated background elements */}
     

      <motion.div 
        className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl relative z-10"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Left Content */}
        <div className="lg:w-1/2 text-center lg:text-left lg:pr-16">
          {/* Greeting s floating sparkles */}
          <motion.div
            custom={0}
            variants={itemVariants}
            className="flex items-center justify-center lg:justify-start space-x-3 mb-8"
          >
            <motion.div variants={sparkleVariants}>
              <Sparkles className="w-5 h-5 text-blue-500" />
            </motion.div>
            <motion.p 
              className="text-muted-foreground font-mono text-base lg:text-lg tracking-wider"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {heroData.greeting}
            </motion.p>
            <motion.div variants={sparkleVariants}>
              <Sparkles className="w-5 h-5 text-purple-500" />
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            custom={1}
            variants={itemVariants}
            className=" text-4xl lg:text-7xl font-serif text-foreground mb-6 leading-tight"
          >
            {heroData.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            custom={2}
            variants={itemVariants}
            className="text-3xl lg:text-5xl font-bold text-muted-foreground mb-8 leading-tight"
          >
            {heroData.subtitle}
          </motion.h2>
        </div>

        {/* Right Content */}
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start mt-12 lg:mt-0">
          {/* Description */}
          <motion.p
            custom={3}
            variants={itemVariants}
            className="text-lg lg:text-xl text-muted-foreground max-w-md text-center lg:text-left mb-12 leading-relaxed"
          >
            {heroData.description}
          </motion.p>

          {/* CTA Buttons s pokročilými hover efektmi */}
          <div className="flex  space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.div
              custom={4}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: easings.smooth }}
            >
              <Button
                variant="outline"
                size="lg"
                className="font-mono group relative overflow-hidden"
                onClick={() => {
                  const target = document.querySelector("#work");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <motion.span
                  className="relative z-10 flex items-center space-x-2"
                  whileHover={{ x: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{heroData.ctaText}</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.span>

                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-primary/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>

            <motion.div
              custom={5}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: easings.smooth }}
            >
              <Button
                variant="default"
                size="lg"
                className="font-mono relative overflow-hidden"
                onClick={() => {
                  const target = document.querySelector("#contact");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {heroData.cta2Text}
                </motion.span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
