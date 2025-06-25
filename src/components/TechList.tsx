"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface TechListProps {
  technologies: string[];
  scrollProgress: MotionValue<number>;
  introText: string;
}

export function TechList({
  technologies,
  scrollProgress,
  introText,
}: TechListProps) {
  // ✅ Skorší reveal - začína v strede About sekcie
  const techOpacity = useTransform(scrollProgress, [0.4, 0.6], [0, 1]);
  const techY = useTransform(scrollProgress, [0.4, 0.6], [40, 0]);
  const techBlur = useTransform(scrollProgress, [0.4, 0.6], [8, 0]);

  return (
    <motion.div
      className="mt-16"
      style={{
        opacity: techOpacity,
        y: techY,
        filter: techBlur,
      }}
    >
      <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg">
        {introText}
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {technologies.map((tech, index) => (
          <TechItem 
            key={tech}
            name={tech}
            index={index}
            scrollProgress={scrollProgress}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface TechItemProps {
  name: string;
  index: number;
  scrollProgress: MotionValue<number>;
}

function TechItem({ name, index, scrollProgress }: TechItemProps) {
  // ✅ Stagger animácia začína skôr
  const baseStart = 0.5; // Začína v strede About sekcie
  const itemStart = baseStart + (index * 0.01); // Malý stagger delay
  const itemEnd = itemStart + 0.1; // Kratší reveal window

  const itemOpacity = useTransform(
    scrollProgress,
    [itemStart, itemEnd],
    [0, 1]
  );

  const itemX = useTransform(
    scrollProgress,
    [itemStart, itemEnd],
    [-20, 0]
  );

  return (
    <motion.div
      className="flex items-center space-x-3 py-2"
      style={{
        opacity: itemOpacity,
        x: itemX,
      }}
    >
      <span className="text-gray-400 dark:text-gray-600">▸</span>
      <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
        {name}
      </span>
    </motion.div>
  );
}
