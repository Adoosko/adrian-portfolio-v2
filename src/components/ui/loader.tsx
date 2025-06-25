"use client";

import { motion } from "framer-motion";

// Premium easing functions pre profesionálny dojem
const premiumEasing = {
  gentle: [0.25, 0.1, 0.25, 1],
  smooth: [0.4, 0, 0.2, 1],
  dramatic: [0.22, 1, 0.36, 1],
};

const Loader = () => {
  const text = "adrian.";
  const letters = text.split("");

  // Container variants pre smooth orchestráciu
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Faster stagger
        delayChildren: 0.2,   // Faster delay
      },
    },
    exit: {
      y: "-100%", // Slide up to reveal content
      transition: {
        duration: 1.0, // Faster slide
        ease: premiumEasing.smooth, // Smoother easing
      },
    },
  };

  // Letter variants s premium blur efektom
  const letterVariants = {
    hidden: {
      filter: "blur(8px)",
      opacity: 0,
      y: 10,
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6, // Faster letter appearance
        ease: premiumEasing.gentle,
      },
    },
    exit: {},
  };

  // Subtle cursor variants
  const cursorVariants = {
    blink: {
      opacity: [0, 0, 1, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.5, 0.5, 1],
        delay: letters.length * 0.05 + 0.4, // Adjusted delay to match new timings
      },
    },
    exit: {},
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-100 dark:bg-neutral-900"
    >
      {/* Subtle background glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.015 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute inset-0 bg-gradient-radial from-foreground/5 via-transparent to-transparent"
      />

      {/* Main text container */}
      <div className="relative">
        <motion.div className="flex items-baseline font-mono">
          {/* Letter-by-letter reveal */}
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="inline-block text-5xl lg:text-7xl font-serif text-foreground tracking-tight"
              style={{
                minWidth: letter === 'i' ? '0.25em' : '0.5em',
                textAlign: 'center',
              }}
            >
              {letter}
            </motion.span>
          ))}

          {/* Minimalistic cursor */}
          <motion.div
            variants={cursorVariants}
            animate="blink"
            className="inline-block w-[1px] h-12 lg:h-16 bg-foreground/60 ml-1"
          />
        </motion.div>

        {/* Subtle underline animation */}
       
      </div>
    </motion.div>
  );
};

export default Loader;
