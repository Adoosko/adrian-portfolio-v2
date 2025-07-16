'use client';

import { motion, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const smoothMouse = {
    x: useSpring(0, { stiffness: 200, damping: 40, mass: 1 }),
    y: useSpring(0, { stiffness: 200, damping: 40, mass: 1 }),
  };

  // Desktop detection
  useEffect(() => {
    const checkIsDesktop = () => {
      const hasHoverCapability = window.matchMedia('(hover: hover)').matches;
      const isPrimaryPointerFine = window.matchMedia('(pointer: fine)').matches;
      const isWidescreenDevice = window.innerWidth >= 1024;
      
      return hasHoverCapability && isPrimaryPointerFine && isWidescreenDevice;
    };

    setIsDesktop(checkIsDesktop());

    const handleResize = () => {
      setIsDesktop(checkIsDesktop());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Activate cursor only on desktop
    if (!isDesktop) return;

    const updateMousePosition = (e: MouseEvent) => {
      smoothMouse.x.set(e.clientX);
      smoothMouse.y.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('a, button, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    // Hide default cursor on desktop
    document.body.style.cursor = 'none';

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      // Restore default cursor
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDesktop, smoothMouse.x, smoothMouse.y]);

  // Don't render cursor on mobile/tablet
  if (!isDesktop) return null;

  const cursorVariants = {
    default: {
      scale: 1,
      opacity: 1,
    },
    hover: {
      scale: 0.5,
      opacity: 0.8,
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
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    />
  );
}
