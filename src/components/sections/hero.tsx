'use client';

import { Button } from '@/components/ui/button';
import { useAnimationStore } from '@/stores/animation-store';
import {
  LazyMotion,
  domAnimation,
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
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

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

// Optimalizované constants pre 2025 performance
const EASING_DRAMATIC = [0.22, 1, 0.36, 1] as const;
const EASING_SMOOTH = [0.25, 0.46, 0.45, 0.94] as const;
const EASING_BOUNCE = [0.68, -0.55, 0.265, 1.55] as const;

// Optimalizované variants pre rýchlejšie loading
const createContainerVariants = (): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
});

const createItemVariants = (): Variants => ({
  hidden: {
    y: 30,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: EASING_SMOOTH,
    },
  },
});

// Optimalizované sparkle s hardware acceleration
const sparkleVariants: Variants = {
  hidden: { scale: 0, rotate: 0 },
  visible: {
    scale: [0, 1.1, 1],
    rotate: [0, 180, 360],
    transition: {
      duration: 1.5,
      ease: EASING_BOUNCE,
      repeat: Infinity,
      repeatType: 'reverse',
      delay: 0.3,
    },
  },
};

// Memoizovaný ScrollButton pre performance
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
      transition={{ duration: 0.2, ease: EASING_SMOOTH }}
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

// Optimalizovaný AnimatedSparkle pre performance
const AnimatedSparkle = memo<{ 
  color: string; 
  delay?: number;
  className?: string;
}>(({ color, delay = 0, className = 'w-5 h-5' }) => (
  <motion.div
    variants={sparkleVariants}
    initial="hidden"
    animate="visible"
    style={{ 
      color, 
      willChange: 'transform',
      transform: 'translateZ(0)'
    }}
    transition={{ delay }}
    className={className}
  >
    <Sparkles />
  </motion.div>
));

AnimatedSparkle.displayName = 'AnimatedSparkle';

// Optimalizovaný mouse tracking s throttling
const useMouseTracking = (isEnabled: boolean) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef<HTMLElement>(null);
  const lastMoveTime = useRef(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [1, -1]),
    { stiffness: 100, damping: 30 }
  );
  
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-1, 1]),
    { stiffness: 100, damping: 30 }
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isEnabled || !containerRef.current) return;

      // Throttling pre 60fps
      const now = Date.now();
      if (now - lastMoveTime.current < 16) return;
      lastMoveTime.current = now;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const sensitivity = 0.5;
      mouseX.set((event.clientX - centerX) * sensitivity);
      mouseY.set((event.clientY - centerY) * sensitivity);
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

// SSR-safe intersection observer
const useIntersectionObserver = (threshold = 0.3) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const element = elementRef.current;
    if (!element || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        startTransition(() => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { elementRef, isVisible: mounted && isVisible };
};

// Hlavný Hero komponent s LazyMotion wrapper
export const Hero = memo<HeroProps>(({ data }) => {
  const animateHero = useAnimationStore((state) => state.animateHero);
  const { elementRef, isVisible } = useIntersectionObserver();
  const [canAnimate, setCanAnimate] = useState(false);
  
  // Delayed animation start pre performance
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setCanAnimate(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Conditional mouse tracking
  const isMouseTrackingEnabled = canAnimate && 
    typeof window !== 'undefined' && 
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
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

  // Optimalizované transform style
  const transformStyle = useMemo(() => ({
    rotateX,
    rotateY,
    transformStyle: 'preserve-3d' as const,
    willChange: 'transform',
  }), [rotateX, rotateY]);

  const shouldAnimate = animateHero && canAnimate;

  return (
    <LazyMotion features={domAnimation}>
      <motion.section
        ref={(el) => {
          elementRef.current = el;
          containerRef.current = el;
        }}
        variants={containerVariants}
        initial="hidden"
        animate={shouldAnimate ? 'visible' : 'hidden'}
        className="min-h-screen flex items-center justify-center px-6 lg:px-20 relative overflow-hidden"
        onMouseMove={isMouseTrackingEnabled ? handleMouseMove : undefined}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: '1200px',
          contain: 'layout style',
        }}
      >
        <motion.div 
          className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl relative z-10"
          style={transformStyle}
        >
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left lg:pr-16">
            {/* Greeting s optimalizovanými sparkles */}
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
              <AnimatedSparkle color="#a855f7" delay={0.15} />
            </motion.div>

            {/* Main Title - LCP kritický element */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl lg:text-7xl font-serif text-foreground mb-6 leading-tight"
              style={{
                
                contain: 'layout',
              }}
            >
              {data.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              variants={itemVariants}
              className="text-3xl lg:text-5xl font-bold text-muted-foreground mb-8 leading-tight"
            >
              {data.subtitle}
            </motion.h2>
          </div>

          {/* Right Content */}
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start mt-12 lg:mt-0">
            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg lg:text-xl text-muted-foreground max-w-md text-center lg:text-left mb-12 leading-relaxed"
            >
              {data.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
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
                    animate={{ x: [0, 3, 0] }}
                    transition={{
                      duration: 2,
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

              <ScrollButton
                variant="default"
                size="lg"
                targetId="contact"
                className="font-mono relative overflow-hidden"
              >
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {data.cta2Text}
                </motion.span>
              </ScrollButton>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    </LazyMotion>
  );
});

Hero.displayName = 'Hero';
