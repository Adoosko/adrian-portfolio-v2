//@ts-nocheck
"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface SectionHeaderProps {
  scrollProgress: MotionValue<number>;
  title: string;
}

export function SectionHeader({ scrollProgress, title }: SectionHeaderProps) {
  const headerOpacity = useTransform(scrollProgress, [0, 0.2], [0, 1]);
  const headerY = useTransform(scrollProgress, [0, 0.2], [50, 0]);
  const lineWidth = useTransform(scrollProgress, [0.1, 0.3], [0, 1]);

  return (
    <motion.div 
      className="flex items-center space-x-6"
      style={{ opacity: headerOpacity, y: headerY }}
    >
      <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
        01
      </span>
      
      <h2 className="text-2xl lg:text-3xl font-light text-black dark:text-white">
        {title}
      </h2>
      
      <motion.div 
        className="flex-1 h-px bg-gray-300 dark:bg-gray-700"
        style={{ scaleX: lineWidth }}
        transformOrigin="left"
      />
    </motion.div>
  );
}
