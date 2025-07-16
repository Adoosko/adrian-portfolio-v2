'use client';

import { Button } from '@/components/ui/button';
import { useAnimationStore } from '@/stores/animation-store';
import { ArrowRight, Sparkles } from 'lucide-react';
import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants
} from 'motion/react';
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

// Optimalizované constants
const EASING_SMOOTH = [0.25, 0.46, 0.45, 0.94] as const;
const EASING_BOUNCE = [0.68, -0.55, 0.265, 1.55] as const;

// Device detection utilities s proper fallbacks
const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

const isLowEndDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const connection = (navigator as any).connection;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory = (navigator as any).deviceMemory || 4;
  
  return (
    hardwareConcurrency <= 2 ||
    deviceMemory <= 2 ||
    (connection && connection.saveData) ||
    (connection && connection.effectiveType === 'slow-2g')
  );
};

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Optimalizované variants factory
const createMobileVariants = (isMobileDevice: boolean): Variants => ({
  hidden: { 
    opacity: 0, 
    y: isMobileDevice ? 16 : 24,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: isMobileDevice ? 0.3 : 0.5,
      staggerChildren: isMobileDevice ? 0.06 : 0.08,
      delayChildren: isMobileDevice ? 0.05 : 0.1,
      ease: EASING_SMOOTH,
    },
  },
});

// Sparkle variants s performance optimalizáciou
const sparkleVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.1, 1],
    opacity: [0, 1, 0.8],
    transition: {
      duration: 1.5,
      ease: EASING_BOUNCE,
      repeat: Infinity,
      repeatType: 'reverse',
      delay: 0.2,
    },
  },
};

// Optimalizovaný ScrollButton s proper accessibility
const ScrollButton = memo<{
  variant: 'outline' | 'default';
  size: 'lg';
  children: React.ReactNode;
  targetId: string;
  className?: string;
  isMobile?: boolean;
}>((props) => {
  const { variant, size, children, targetId, className, isMobile = false } = props;
  
  const handleClick = useCallback(() => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }, [targetId]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <m.div
      whileHover={!isMobile ? { scale: 1.02, y: -1 } : undefined}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: EASING_SMOOTH }}
    >
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={`Navigate to ${targetId} section`}
        role="button"
        tabIndex={0}
      >
        {children}
      </Button>
    </m.div>
  );
});

ScrollButton.displayName = 'ScrollButton';

// Optimalizovaný AnimatedSparkle s proper cleanup
const AnimatedSparkle = memo<{ 
  color: string; 
  delay?: number;
  enabled?: boolean;
}>(({ color, delay = 0, enabled = true }) => {
  if (!enabled) return null;
  
  return (
    <m.div
      variants={sparkleVariants}
      initial="hidden"
      animate="visible"
      style={{ 
        color,
        willChange: 'transform, opacity',
        contain: 'layout style paint',
      }}
      transition={{ delay }}
      className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0"
      aria-hidden="true"
    >
      <Sparkles aria-hidden="true" />
    </m.div>
  );
});

AnimatedSparkle.displayName = 'AnimatedSparkle';

// Optimalizovaný mouse tracking s proper cleanup
const useMouseTracking = (isEnabled: boolean) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(null);

  const rotateX = useSpring(
    useTransform(mouseY, [-200, 200], [0.3, -0.3]),
    { stiffness: 120, damping: 25, mass: 0.5 }
  );
  
  const rotateY = useSpring(
    useTransform(mouseX, [-200, 200], [-0.3, 0.3]),
    { stiffness: 120, damping: 25, mass: 0.5 }
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isEnabled || !containerRef.current) return;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const rect = containerRef.current!.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const sensitivity = 0.3;
        mouseX.set((event.clientX - centerX) * sensitivity);
        mouseY.set((event.clientY - centerY) * sensitivity);
      });
    },
    [isEnabled, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return {
    containerRef,
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseLeave,
  };
};

// Optimalizovaný intersection observer s proper cleanup
const useIntersectionObserver = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        startTransition(() => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { 
        threshold,
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { elementRef, isVisible: mounted && isVisible };
};

// Device capabilities hook s proper cleanup
const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    isLowEnd: false,
    reduceMotion: false,
  });

  useEffect(() => {
    const updateCapabilities = () => {
      setCapabilities({
        isMobile: isMobile(),
        isLowEnd: isLowEndDevice(),
        reduceMotion: prefersReducedMotion(),
      });
    };

    updateCapabilities();

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', updateCapabilities);

    window.addEventListener('resize', updateCapabilities);

    return () => {
      mediaQuery.removeEventListener('change', updateCapabilities);
      window.removeEventListener('resize', updateCapabilities);
    };
  }, []);

  return capabilities;
};

// Main Hero component s optimalizáciami
export const Hero = memo<HeroProps>(({ data }) => {
  const animateHero = useAnimationStore((state) => state.animateHero);
  const { elementRef, isVisible } = useIntersectionObserver();
  const { isMobile, isLowEnd, reduceMotion } = useDeviceCapabilities();

  const enableMouseTracking = !isMobile && !reduceMotion && !isLowEnd;
  const enableSparkles = !reduceMotion && !isLowEnd;

  const {
    containerRef,
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseLeave,
  } = useMouseTracking(enableMouseTracking);

  const variants = useMemo(() => createMobileVariants(isMobile), [isMobile]);

  const transformStyle = useMemo(() =>
    enableMouseTracking ? {
      rotateX,
      rotateY,
      transformStyle: 'preserve-3d' as const,
    } : {},
    [enableMouseTracking, rotateX, rotateY]
  );

  const shouldAnimate = animateHero && isVisible;

  return (
    <LazyMotion features={domAnimation}>
      <m.section
        ref={(el) => {
          elementRef.current = el;
          if (enableMouseTracking) {
            containerRef.current = el;
          }
        }}
        variants={variants}
        initial="hidden"
        animate={shouldAnimate ? 'visible' : 'hidden'}
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-20 relative"
        onMouseMove={enableMouseTracking ? handleMouseMove : undefined}
        onMouseLeave={enableMouseTracking ? handleMouseLeave : undefined}
        style={{
          perspective: enableMouseTracking ? '1000px' : 'none',
          contain: 'layout style paint',
        }}
        role="banner"
        aria-label="Hero section"
      >
        <m.div
          className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl relative"
          style={transformStyle}
        >
          <div className="w-full lg:w-1/2 text-center lg:text-left lg:pr-16">
            <m.div
              variants={variants}
              className="flex items-center justify-center lg:justify-start space-x-3 mb-6 lg:mb-8"
              role="presentation"
            >
              <AnimatedSparkle color="#3b82f6" delay={0} enabled={enableSparkles} />
              <m.p
                className="text-muted-foreground text-sm sm:text-base lg:text-lg tracking-wider"
                animate={!reduceMotion ? { opacity: [0.7, 1, 0.7] } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {data.greeting}
              </m.p>
              <AnimatedSparkle color="#a855f7" delay={0.1} enabled={enableSparkles} />
            </m.div>

            <m.h1
              variants={variants}
              className="text-3xl sm:text-4xl lg:text-7xl font-serif text-foreground mb-4 lg:mb-6 leading-tight"
              style={{
                contain: 'layout style',
                willChange: 'transform, opacity',
              }}
            >
              {data.title}
            </m.h1>

            <m.h2
              variants={variants}
              className="text-xl sm:text-2xl lg:text-5xl font-bold text-muted-foreground mb-6 lg:mb-8 leading-tight"
            >
              {data.subtitle}
            </m.h2>

            <m.p
              variants={variants}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-md mx-auto lg:mx-0 text-center lg:text-left mb-8 lg:mb-12 leading-relaxed"
            >
              {data.description}
            </m.p>

            <m.div
              variants={variants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center lg:items-start lg:justify-start"
            >
              <ScrollButton
                variant="outline"
                size="lg"
                targetId="work"
                className="w-full sm:w-auto font-mono group relative overflow-hidden"
                isMobile={isMobile}
              >
                <m.span
                  className="relative z-10 flex items-center justify-center space-x-2"
                  whileHover={!isMobile ? { x: -1 } : undefined}
                  transition={{ duration: 0.15 }}
                >
                  <span>{data.ctaText}</span>
                  <m.div
                    animate={!reduceMotion ? { x: [0, 2, 0] } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </m.div>
                </m.span>
                <m.div
                  className="absolute inset-0 bg-primary/10"
                  initial={{ x: '-100%' }}
                  whileHover={!isMobile ? { x: 0 } : undefined}
                  transition={{ duration: 0.25 }}
                />
              </ScrollButton>

              <ScrollButton
                variant="default"
                size="lg"
                targetId="contact"
                className="w-full sm:w-auto font-mono relative overflow-hidden"
                isMobile={isMobile}
              >
                <m.span
                  whileHover={!isMobile ? { scale: 1.01 } : undefined}
                  transition={{ duration: 0.15 }}
                >
                  {data.cta2Text}
                </m.span>
              </ScrollButton>
            </m.div>
          </div>
        </m.div>
      </m.section>
    </LazyMotion>
  );
});

Hero.displayName = 'Hero';
