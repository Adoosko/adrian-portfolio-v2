'use client';

import { Button } from '@/components/ui/button';
import { useAnimationStore } from '@/stores/animation-store';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants
} from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import {
  memo,
  startTransition,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// Optimalizované typy
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

// Konstanty mimo komponentu pre lepšiu performance
const EASING_DRAMATIC = [0.22, 1, 0.36, 1] as const;
const EASING_SMOOTH = [0.25, 0.46, 0.45, 0.94] as const;
const EASING_BOUNCE = [0.68, -0.55, 0.265, 1.55] as const;

// Optimalizované variants s memoization
const createContainerVariants = (): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.15,
    },
  },
});

const createItemVariants = (): Variants => ({
  hidden: {
    y: 60,
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: EASING_DRAMATIC,
    },
  },
});

// Optimalizované sparkle animácie
const sparkleVariants: Variants = {
  hidden: { scale: 0, rotate: 0 },
  visible: {
    scale: [0, 1.2, 1],
    rotate: [0, 180, 360],
    transition: {
      duration: 2,
      ease: EASING_BOUNCE,
      repeat: Infinity,
      repeatType: 'reverse',
      delay: 1,
    },
  },
};

// Memoizovaný ScrollButton komponent
const ScrollButton = memo<{
  variant: 'outline' | 'default';
  size: 'lg';
  children: React.ReactNode;
  targetId: string;
  className?: string;
}>((props) => {
  const { variant, size, children, targetId, className } = props;
  
  const handleClick = useCallback(() => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, [targetId]);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3, ease: EASING_SMOOTH }}
    >
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
      >
        {children}
      </Button>
    </motion.div>
  );
});

ScrollButton.displayName = 'ScrollButton';

// Optimalizovaný AnimatedSparkle komponent
const AnimatedSparkle = memo<{ color: string; delay?: number }>(({ color, delay = 0 }) => (
  <motion.div
    variants={sparkleVariants}
    initial="hidden"
    animate="visible"
    style={{ color }}
    transition={{ delay }}
  >
    <Sparkles className="w-5 h-5" />
  </motion.div>
));

AnimatedSparkle.displayName = 'AnimatedSparkle';

// Optimalizovaný mouse tracking hook
const useMouseTracking = (isEnabled: boolean) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef<HTMLElement>(null);

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [2, -2]),
    { stiffness: 100, damping: 30 }
  );
  
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-2, 2]),
    { stiffness: 100, damping: 30 }
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isEnabled || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Použitie requestAnimationFrame pre smooth updates
      startTransition(() => {
        mouseX.set(event.clientX - centerX);
        mouseY.set(event.clientY - centerY);
      });
    },
    [isEnabled, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return {
    containerRef,
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseLeave,
  };
};

// Optimalizovaný intersection observer hook
const useIntersectionObserver = (threshold = 0.3) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { elementRef, isVisible };
};

// Hlavný Hero komponent s brutal optimalizáciami
export const Hero = memo<HeroProps>(({ data }) => {
  const animateHero = useAnimationStore((state) => state.animateHero);
  const { elementRef, isVisible } = useIntersectionObserver();
  const isMouseTrackingEnabled = isVisible && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const {
    containerRef,
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseLeave,
  } = useMouseTracking(isMouseTrackingEnabled);

  // Memoizované variants
  const containerVariants = useMemo(() => createContainerVariants(), []);
  const itemVariants = useMemo(() => createItemVariants(), []);

  // Optimalizované CSS custom properties
  const motionStyle = useMemo(() => ({
    '--perspective': '1000px',
    perspective: 'var(--perspective)',
  } as React.CSSProperties), []);

  const transformStyle = useMemo(() => ({
    rotateX,
    rotateY,
    transformStyle: 'preserve-3d' as const,
  }), [rotateX, rotateY]);

  return (
    <motion.section
      ref={(el) => {
        elementRef.current = el;
        containerRef.current = el;
      }}
      variants={containerVariants}
      initial="hidden"
      animate={animateHero && isVisible ? 'visible' : 'hidden'}
      className="min-h-screen flex items-center justify-center px-6 lg:px-20 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={motionStyle}
    >
      <motion.div 
        className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl relative z-10"
        style={transformStyle}
      >
        {/* Left Content */}
        <div className="lg:w-1/2 text-center lg:text-left lg:pr-16">
          {/* Optimalizované greeting s sparkles */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center lg:justify-start space-x-3 mb-8"
          >
            <AnimatedSparkle color="#3b82f6" delay={0} />
            <motion.p 
              className="text-muted-foreground font-mono text-base lg:text-lg tracking-wider"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {data.greeting}
            </motion.p>
            <AnimatedSparkle color="#a855f7" delay={0.2} />
          </motion.div>

          {/* Typography optimalizácie */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl lg:text-7xl font-serif text-foreground mb-6 leading-tight"
          >
            {data.title}
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="text-3xl lg:text-5xl font-bold text-muted-foreground mb-8 leading-tight"
          >
            {data.subtitle}
          </motion.h2>
        </div>

        {/* Right Content */}
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start mt-12 lg:mt-0">
          <motion.p
            variants={itemVariants}
            className="text-lg lg:text-xl text-muted-foreground max-w-md text-center lg:text-left mb-12 leading-relaxed"
          >
            {data.description}
          </motion.p>

          {/* Optimalizované CTA Buttons */}
          <div className="flex flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.div variants={itemVariants}>
              <ScrollButton
                variant="outline"
                size="lg"
                targetId="work"
                className="font-mono group relative overflow-hidden"
              >
                <motion.span
                  className="relative z-10 flex items-center space-x-2"
                  whileHover={{ x: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{data.ctaText}</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-primary/10"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </ScrollButton>
            </motion.div>

            <motion.div variants={itemVariants}>
              <ScrollButton
                variant="default"
                size="lg"
                targetId="contact"
                className="font-mono relative overflow-hidden"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {data.cta2Text}
                </motion.span>
              </ScrollButton>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
});

Hero.displayName = 'Hero';
