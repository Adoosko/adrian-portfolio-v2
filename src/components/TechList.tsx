"use client";

import { motion, MotionValue, useTransform } from "motion/react";
import Image from "next/legacy/image";

interface Tech {
  name: string;
  logo: string;
}

interface TechListProps {
  technologies: Tech[];
  scrollProgress: MotionValue<number>;
  introText: string;
}

export function TechList({
  technologies,
  scrollProgress,
  introText,
}: TechListProps) {
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
            key={tech.name}
            name={tech.name}
            logo={tech.logo}
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
  logo: string;
  index: number;
  scrollProgress: MotionValue<number>;
}

function TechItem({ name, logo, index, scrollProgress }: TechItemProps) {
  const baseStart = 0.5;
  const itemStart = baseStart + (index * 0.01);
  const itemEnd = itemStart + 0.1;

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

  let imageClassName = '';
  if (name === 'Vercel') {
    imageClassName = 'invert dark:invert-0';
  } else if (name === 'Next.js') {
    imageClassName = 'dark:invert';
  }

  return (
    <motion.div
      className="flex items-center space-x-3 py-2"
      style={{
        opacity: itemOpacity,
        x: itemX,
      }}
    >
      <Image src={logo} alt={`${name} logo`} width={20} height={20} className={imageClassName} />
      <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
        {name}
      </span>
    </motion.div>
  );
}
