"use client";

import { motion, MotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface ProfileImageProps {
  image?: any;
  scrollProgress: MotionValue<number>;
  priority?: boolean;
}

export function ProfileImage({ scrollProgress, priority = false }: ProfileImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Smooth reveal animations
  const imageOpacity = useTransform(scrollProgress, [0.2, 0.4], [0, 1]);
  const imageScale = useTransform(scrollProgress, [0.2, 0.4], [0.95, 1]);
  const imageY = useTransform(scrollProgress, [0.2, 0.4], [20, 0]);
  
  // Subtle floating effect during scroll
  const floatY = useTransform(scrollProgress, [0.4, 1], [0, -10]);
  const smoothFloatY = useSpring(floatY, { stiffness: 100, damping: 30 });
  
  // Rotation effect based on scroll
  const rotate = useTransform(scrollProgress, [0.4, 1], [0, 2]);
  const smoothRotate = useSpring(rotate, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="relative group"
      style={{
        opacity: imageOpacity,
        scale: imageScale,
        y: imageY,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating effect container */}
      <motion.div
        style={{
          y: smoothFloatY,
          rotate: smoothRotate,
        }}
        className="relative"
      >
        {/* Main image container */}
        <motion.div
          className="aspect-square rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden relative"
          whileHover={{
            scale: 1.02,
            rotateY: 5,
          }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {/* Background glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Image */}
          <Image
            src="/optimized/profile.png"
            alt="Adrian Finik"
            width={500}
            height={500}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 relative z-10"
            priority={priority}
          />
          
          {/* Overlay gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"
          />
        </motion.div>

        {/* Floating elements around image */}
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full opacity-60"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute -bottom-3 -left-3 w-3 h-3 bg-purple-500 rounded-full opacity-40"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Status indicator */}
        <motion.div
          className="absolute bottom-4 right-4 flex items-center space-x-2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-foreground">Available</span>
        </motion.div>
      </motion.div>

      {/* Shadow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg blur-xl -z-10"
        style={{
          y: smoothFloatY,
          scale: imageScale,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
