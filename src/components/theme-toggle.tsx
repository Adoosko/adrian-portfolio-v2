//@ts-nocheck
"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl border border-border bg-background animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        rotate: isDark ? 180 : -180,
      }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative w-10 h-10 rounded-xl border border-border/50 bg-gradient-to-br from-background to-muted hover:border-border transition-all duration-500 flex items-center justify-center overflow-hidden group"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      layout
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
        animate={{
          background: isDark
            ? "radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Rotating background */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          background: isDark
            ? "linear-gradient(45deg, rgba(251, 191, 36, 0.05), rgba(245, 158, 11, 0.05))"
            : "linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))",
          rotate: isHovered ? 360 : 0,
        }}
        transition={{
          background: { duration: 0.5 },
          rotate: {
            duration: 2,
            ease: "linear",
            repeat: isHovered ? Infinity : 0,
          },
        }}
      />

      {/* Icon container */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{
                y: 20,
                opacity: 0,
                rotate: -180,
                scale: 0.5,
              }}
              animate={{
                y: 0,
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
                rotate: 180,
                scale: 0.5,
              }}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="flex items-center justify-center"
            >
              <motion.div
                animate={{
                  rotate: isHovered ? [0, 360] : 0,
                }}
                transition={{
                  duration: 2,
                  ease: "linear",
                  repeat: isHovered ? Infinity : 0,
                }}
              >
                <Sun className="h-4 w-4 text-white" strokeWidth={2.5} />
              </motion.div>

              {/* Sun rays */}
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{
                y: -20,
                opacity: 0,
                rotate: 180,
                scale: 0.5,
              }}
              animate={{
                y: 0,
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              exit={{
                y: 20,
                opacity: 0,
                rotate: -180,
                scale: 0.5,
              }}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className="flex items-center justify-center relative"
            >
              <motion.div
                animate={{
                  rotate: isHovered ? [0, -10, 10, 0] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: isHovered ? Infinity : 0,
                  ease: "easeInOut",
                }}
              >
                <Moon className="h-4 w-4 text-neutral-900" strokeWidth={2.5} />
              </motion.div>

              {/* Stars around moon */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-current opacity-0"
        animate={{
          scale: [1, 1.2],
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        key={theme} // Trigger animation on theme change
      />
    </motion.button>
  );
}
