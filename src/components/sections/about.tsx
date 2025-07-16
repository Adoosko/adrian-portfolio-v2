'use client';

import { LazyMotion, domAnimation, useScroll } from 'motion/react';
import React, {
  memo,
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

// Lazy loading komponentov s proper typovaním
const ProfileImage = memo(
  React.lazy(() => import('../ProfileImage').then(m => ({ default: m.ProfileImage })))
);
const ScrollTextReveal = memo(
  React.lazy(() => import('../ScrollRevealText').then(m => ({ default: m.ScrollTextReveal })))
);
const SectionHeader = memo(
  React.lazy(() => import('../SectionHeader').then(m => ({ default: m.SectionHeader })))
);
const TechList = memo(
  React.lazy(() => import('../TechList').then(m => ({ default: m.TechList })))
);

interface AboutProps {
  data: {
    title: string;
    description: string;
    technologies: { name: string; logo: string }[];
    tech_list_intro: string;
  };
}

// ✅ OPRAVENÉ: SSR-safe intersection observer
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

  return { elementRef, isVisible: mounted ? isVisible : false };
};

// ✅ OPRAVENÉ: Optimalizovaný scroll s proper typing
const useOptimizedScroll = (containerRef: React.RefObject<HTMLElement>) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return { scrollYProgress };
};

// Hlavný About komponent s opravenými errors ale zachovanými animáciami
const About: React.FC<AboutProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { elementRef, isVisible } = useIntersectionObserver();
  const { scrollYProgress } = useOptimizedScroll(containerRef as React.RefObject<HTMLElement>);

  // Memoizované props pre child komponenty
  const headerProps = useMemo(() => ({
    scrollProgress: scrollYProgress,
    title: data.title,
  }), [scrollYProgress, data.title]);

  const textRevealProps = useMemo(() => ({
    blurStrength: 4,
    revealSpeed: 'slow' as const,
    className: 'mb-0',
    children: data.description,
  }), [data.description]);

  const techListProps = useMemo(() => ({
    technologies: data.technologies,
    scrollProgress: scrollYProgress,
    introText: data.tech_list_intro,
  }), [data.technologies, scrollYProgress, data.tech_list_intro]);

  const profileImageProps = useMemo(() => ({
    scrollProgress: scrollYProgress,
  }), [scrollYProgress]);

  return (
    <LazyMotion features={domAnimation}>
      <section
        id="about"
        ref={(el) => {
          if (el) {
            (containerRef as React.MutableRefObject<HTMLElement>).current = el;
            (elementRef as React.MutableRefObject<HTMLElement>).current = el;
          }
        }}
        className="min-h-screen py-20 px-6 lg:px-20 bg-white dark:bg-black"
        aria-labelledby="about-heading"
      >
        <div className="max-w-4xl mx-auto">
          {/* Section Header s mouse tracking animáciami */}
          <React.Suspense fallback={<div className="h-16 animate-pulse bg-muted rounded" />}>
            <SectionHeader {...headerProps} />
          </React.Suspense>

          <div className="grid lg:grid-cols-3 gap-16 mt-16">
            {/* Text Content s ScrollTextReveal */}
            <div className="lg:col-span-2">
              <div className="space-y-8 mb-12">
                <React.Suspense fallback={<div className="h-32 animate-pulse bg-muted rounded" />}>
                  <ScrollTextReveal {...textRevealProps} />
                </React.Suspense>
              </div>
              
              <React.Suspense fallback={<div className="h-24 animate-pulse bg-muted rounded" />}>
                <TechList {...techListProps} />
              </React.Suspense>
            </div>

            {/* Profile Image s sticky positioning a scroll animáciami */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 lg:h-fit">
                <React.Suspense fallback={<div className="aspect-square animate-pulse bg-muted rounded-lg" />}>
                  <ProfileImage {...profileImageProps} />
                </React.Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
};

export default About;
