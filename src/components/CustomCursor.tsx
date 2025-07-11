"use client";

import { motion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);

  const smoothMouse = {
    x: useSpring(0, { stiffness: 200, damping: 40, mass: 1 }),
    y: useSpring(0, { stiffness: 200, damping: 40, mass: 1 }),
  };

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      smoothMouse.x.set(e.clientX);
      smoothMouse.y.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('a, button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [smoothMouse.x, smoothMouse.y]);

  const cursorVariants = {
    default: {
      scale: 1,
    },
    hover: {
      scale: 0.5,
    },
  };

  return (
    <motion.div
      variants={cursorVariants}
      animate={isHovering ? 'hover' : 'default'}
      className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[90000]"
      style={{
        translateX: smoothMouse.x,
        translateY: smoothMouse.y,
        backgroundColor: 'white',
        mixBlendMode: 'exclusion',
      }}
    />
  );
}