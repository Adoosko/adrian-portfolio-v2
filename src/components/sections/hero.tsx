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

// Mobile-first constants
const EASING_SMOOTH = [0.25, 0.46, 0.45, 0.94] as const;
const EASING_BOUNCE = [0.68, -0.55, 0.265, 1.55] as const;

// Device detection utilities
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;
const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  // @ts-ignore
  return navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4;
};

// Mobile-first variants
const createMobileVariants = (isMobileDevice: boolean): Variants => ({
  hidden: { opacity: 0, y: isMobileDevice ? 20 : 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: isMobileDevice ? 0.4 : 0.6,
      staggerChildren: isMobileDevice ? 0.08 : 0.1,
      delayChildren: isMobileDevice ? 0.1 : 0.2,
      ease: EASING_SMOOTH,
    },
  },
});

// Simplified sparkle for mobile
const sparkleVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: [0, 1.1, 1],
    transition: {
      duration: 1.2,
      ease: EASING_BOUNCE,
      repeat: Infinity,
      repeatType: 'reverse',
      delay: 0.2,
    },
  },
};

// Optimalized ScrollButton
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
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, [targetId]);

  return (
    <motion.div
      whileHover={!isMobile ? { scale: 1.05, y: -2 } : undefined}
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

// Simplified AnimatedSparkle
const AnimatedSparkle = memo<{ 
  color: string; 
  delay?: number;
  enabled?: boolean;
}>(({ color, delay = 0, enabled = true }) => {
  if (!enabled) return null;
  
  return (
    <motion.div
      variants={sparkleVariants}
      initial="hidden"
      animate="visible"
      style={{ 
        color,
        willChange: 'transform',
      }}
      transition={{ delay }}
      className="w-4 h-4 lg:w-5 lg:h-5"
    >
      <Sparkles />
    </motion.div>
  );
});

AnimatedSparkle.displayName = 'AnimatedSparkle';

// Simplified mouse tracking - desktop only
const useMouseTracking = (isEnabled: boolean) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const containerRef = useRef<HTMLElement>(null);

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [0.5, -0.5]),
    { stiffness: 100, damping: 30 }
  );
  
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-0.5, 0.5]),
    { stiffness: 100, damping: 30 }
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isEnabled || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set((event.clientX - centerX) * 0.3);
      mouseY.set((event.clientY - centerY) * 0.3);
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

// Mobile-first intersection observer
const useIntersectionObserver = (threshold = 0.1) => {
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

// Main Hero component with mobile-first optimization
export const Hero = memo<HeroProps>(({ data }) => {
  const animateHero = useAnimationStore((state) => state.animateHero);
  const { elementRef, isVisible } = useIntersectionObserver();
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isMobile: false,
    isLowEnd: false,
    reduceMotion: false,
  });

  // Device detection
  useEffect(() => {
    setDeviceCapabilities({
      isMobile: isMobile(),
      isLowEnd: isLowEndDevice(),
      reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }, []);

  // Conditional features based on device
  const enableMouseTracking = !deviceCapabilities.isMobile && 
    !deviceCapabilities.reduceMotion && 
    !deviceCapabilities.isLowEnd;

  const enableSparkles = !deviceCapabilities.reduceMotion && 
    !deviceCapabilities.isLowEnd;

  const {
    containerRef,
    rotateX,
    rotateY,
    handleMouseMove,
    handleMouseLeave,
  } = useMouseTracking(enableMouseTracking);

  // Mobile-first variants
  const variants = useMemo(() => 
    createMobileVariants(deviceCapabilities.isMobile), 
    [deviceCapabilities.isMobile]
  );

  // Transform style - desktop only
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
      <motion.section
        ref={(el) => {
          elementRef.current = el;
          containerRef.current = el;
        }}
        variants={variants}
        initial="hidden"
        animate={shouldAnimate ? 'visible' : 'hidden'}
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-20 relative overflow-hidden"
        onMouseMove={enableMouseTracking ? handleMouseMove : undefined}
        onMouseLeave={enableMouseTracking ? handleMouseLeave : undefined}
        style={{
          perspective: enableMouseTracking ? '1200px' : 'none',
          contain: 'layout style',
        }}
      >
        <motion.div 
          className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl relative z-10"
          style={transformStyle}
        >
          {/* Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left lg:pr-16">
            {/* Greeting with conditional sparkles */}
            <motion.div
              variants={variants}
              className="flex items-center justify-center lg:justify-start space-x-3 mb-6 lg:mb-8"
            >
              <AnimatedSparkle color="#3b82f6" delay={0} enabled={enableSparkles} />
              <motion.p 
                className="text-muted-foreground text-sm sm:text-base lg:text-lg tracking-wider"
                animate={!deviceCapabilities.reduceMotion ? {
                  opacity: [0.7, 1, 0.7],
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {data.greeting}
              </motion.p>
              <AnimatedSparkle color="#a855f7" delay={0.1} enabled={enableSparkles} />
            </motion.div>

            {/* Main Title - LCP critical element */}
            <motion.h1
              variants={variants}
              className="text-3xl sm:text-4xl lg:text-7xl font-serif text-foreground mb-4 lg:mb-6 leading-tight"
              style={{
                contain: 'layout',
              }}
            >
              {data.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.h2
              variants={variants}
              className="text-xl sm:text-2xl lg:text-5xl font-bold text-muted-foreground mb-6 lg:mb-8 leading-tight"
            >
              {data.subtitle}
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={variants}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-md mx-auto lg:mx-0 text-center lg:text-left mb-8 lg:mb-12 leading-relaxed"
            >
              {data.description}
            </motion.p>

            {/* CTA Buttons - Mobile-first */}
            <motion.div 
              variants={variants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center lg:items-start lg:justify-start"
            >
              <ScrollButton
                variant="outline"
                size="lg"
                targetId="work"
                className="w-full sm:w-auto font-mono group relative overflow-hidden"
                isMobile={deviceCapabilities.isMobile}
              >
                <motion.span
                  className="relative z-10 flex items-center justify-center space-x-2"
                  whileHover={!deviceCapabilities.isMobile ? { x: -2 } : undefined}
                  transition={{ duration: 0.2 }}
                >
                  <span>{data.ctaText}</span>
                  <motion.div
                    animate={!deviceCapabilities.reduceMotion ? { x: [0, 3, 0] } : {}}
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
                  whileHover={!deviceCapabilities.isMobile ? { x: 0 } : undefined}
                  transition={{ duration: 0.3 }}
                />
              </ScrollButton>

              <ScrollButton
                variant="default"
                size="lg"
                targetId="contact"
                className="w-full sm:w-auto font-mono relative overflow-hidden"
                isMobile={deviceCapabilities.isMobile}
              >
                <motion.span
                  whileHover={!deviceCapabilities.isMobile ? { scale: 1.02 } : undefined}
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
