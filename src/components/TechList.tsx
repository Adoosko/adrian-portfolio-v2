'use client';

import { motion, MotionValue, useTransform } from "motion/react";
import Image from "next/legacy/image";
import { memo } from "react";

interface Tech {
  name: string;
  logo: string;
}

interface TechListProps {
  technologies: Tech[];
  scrollProgress: MotionValue<number>;
  introText: string;
}

export const TechList = memo<TechListProps>(({
  technologies,
  scrollProgress,
  introText,
}) => {
  // ✅ Správne: Hooks volané na top-level
  const techOpacity = useTransform(scrollProgress, [0.4, 0.6], [0, 1]);
  const techY = useTransform(scrollProgress, [0.4, 0.6], [40, 0]);
  const techBlur = useTransform(scrollProgress, [0.4, 0.6], [8, 0]);

  return (
    <motion.div
      className="mt-16 space-y-8"
      style={{
        opacity: techOpacity,
        y: techY,
        filter: techBlur,
      }}
    >
      <motion.p
        className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {introText}
      </motion.p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
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
});

TechList.displayName = 'TechList';

interface TechItemProps {
  name: string;
  logo: string;
  index: number;
  scrollProgress: MotionValue<number>;
}

const TechItem = memo<TechItemProps>(({ name, logo, index, scrollProgress }) => {
  // ✅ Správne: Hooks volané na top-level
  const baseStart = 0.5;
  const itemStart = baseStart + (index * 0.01);
  const itemEnd = itemStart + 0.1;

  const itemOpacity = useTransform(scrollProgress, [itemStart, itemEnd], [0, 1]);
  const itemX = useTransform(scrollProgress, [itemStart, itemEnd], [-20, 0]);
  const itemScale = useTransform(scrollProgress, [itemStart, itemEnd], [0.9, 1]);

  // CSS classes môžu byť v useMemo
  const imageClassName = (() => {
    const classMap: Record<string, string> = {
      'Vercel': 'invert dark:invert-0',
      'Next.js': 'dark:invert',
    };
    return classMap[name] || '';
  })();

  return (
    <motion.div
      className="group relative flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300"
      style={{
        opacity: itemOpacity,
        x: itemX,
        scale: itemScale,
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 8px 25px -8px rgba(0, 0, 0, 0.1)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 flex-shrink-0">
        <div className="relative w-6 h-6 rounded-sm overflow-hidden">
          <Image 
            src={logo} 
            alt={`${name} logo`} 
            width={24} 
            height={24} 
            className={`object-contain ${imageClassName}`}
            loading="lazy"
          />
        </div>
      </div>
      
      <span className="relative z-10 font-mono text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
        {name}
      </span>
      
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </motion.div>
  );
});

TechItem.displayName = 'TechItem';
