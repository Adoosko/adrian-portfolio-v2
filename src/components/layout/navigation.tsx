'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { useAnimationStore } from '@/stores/animation-store';
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import { ArrowRight, Download, Menu, X } from 'lucide-react';
import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import LanguageSwitcher from '../LanguageSwitcher';

interface NavigationProps {
  data: {
    about: string;
    work: string;
    contact: string;
    resume: string;
    download_resume: string;
  };
}

// Optimalizované constants
const HOVER_SCALE = 1.02;
const HOVER_Y = -2;
const ACTIVE_SCALE = 0.98;
const SCROLL_THRESHOLD = 50;
const INTERSECTION_THRESHOLD = 0.3;

const EASING_DRAMATIC = [0.22, 1, 0.36, 1] as const;
const EASING_SMOOTH = [0.25, 0.46, 0.45, 0.94] as const;

// Optimalizované variants
const createNavVariants = (): Variants => ({
  hidden: { y: -100, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: EASING_DRAMATIC,
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
});

const createItemVariants = (): Variants => ({
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASING_SMOOTH },
  },
});

// Optimalizovaný NavItem komponent
const MemoizedNavItem = memo<{
  item: { name: string; href: string; index: string };
  isActive: boolean;
  isHovered: boolean;
  onHover: (href: string) => void;
  onLeave: () => void;
  onClick: (href: string) => void;
}>(({ item, isActive, isHovered, onHover, onLeave, onClick }) => {
  const handleClick = useCallback(() => onClick(item.href), [item.href, onClick]);
  const handleMouseEnter = useCallback(() => onHover(item.href), [item.href, onHover]);

  return (
    <motion.div className="relative" variants={createItemVariants()}>
      <motion.button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onLeave}
        className={`relative z-10 flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200 rounded-lg ${
          isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
        whileHover={{ 
          scale: HOVER_SCALE, 
          y: HOVER_Y,
          transition: { duration: 0.2, ease: EASING_SMOOTH }
        }}
        whileTap={{ 
          scale: ACTIVE_SCALE,
          transition: { duration: 0.1 }
        }}
      >
        <span className="font-mono text-xs">{item.index}</span>
        <span className="tracking-wide">{item.name}</span>
        
        <motion.div
          initial={{ x: -8, opacity: 0 }}
          animate={{
            x: isHovered ? 0 : -8,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.2, ease: EASING_SMOOTH }}
        >
          <ArrowRight className="w-3 h-3" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {(isHovered || isActive) && (
          <motion.div
            layoutId="navbar-hover"
            className="absolute inset-0 bg-muted rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

MemoizedNavItem.displayName = 'MemoizedNavItem';

// Optimalizované hooks
const useScrollDetection = (threshold = SCROLL_THRESHOLD) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const scrollProgress = useMotionValue(0);
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      scrollProgress.set(latest);
      startTransition(() => {
        setIsScrolled(latest > threshold);
      });
    });

    return unsubscribe;
  }, [scrollY, scrollProgress, threshold]);

  return { isScrolled, scrollProgress: smoothProgress };
};

const useActiveSection = (navItems: { href: string }[]) => {
  const [activeSection, setActiveSection] = useState('');
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: INTERSECTION_THRESHOLD, rootMargin: '-20% 0px -80% 0px' }
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.href.substring(1));
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [navItems]);

  return activeSection;
};

// Hlavný Navigation komponent
const Navigation = memo<NavigationProps>(({ data }) => {
  const navItems = useMemo(() => [
    { name: data.about, href: '#about', index: '01' },
    { name: data.work, href: '#work', index: '02' },
    { name: data.contact, href: '#contact', index: '03' },
  ], [data]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState('');

  const animateHero = useAnimationStore((state) => state.animateHero);
  const { isScrolled, scrollProgress } = useScrollDetection();
  const activeSection = useActiveSection(navItems);

  const navOpacity = useTransform(scrollProgress, [0, SCROLL_THRESHOLD], [0.95, 1]);
  const navScale = useTransform(scrollProgress, [0, SCROLL_THRESHOLD], [0.98, 1]);

  const navVariants = useMemo(() => createNavVariants(), []);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMobileMenuOpen(false);
  }, []);

  const handleHover = useCallback((href: string) => {
    setHoveredPath(href);
  }, []);

  const handleLeave = useCallback(() => {
    setHoveredPath('');
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const navStyle = useMemo(() => ({
    opacity: navOpacity,
    scale: navScale,
  }), [navOpacity, navScale]);

  return (
    <LazyMotion features={domAnimation}>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate={animateHero ? 'visible' : 'hidden'}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-lg'
            : 'bg-transparent'
        }`}
        style={navStyle}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <motion.div variants={createItemVariants()}>
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xl lg:text-2xl font-mono font-semibold tracking-tight text-foreground"
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
              >
                AF
              </motion.button>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <motion.div 
                className="flex items-center space-x-1 relative bg-muted/50 rounded-xl p-1.5 border border-border/50"
                variants={createItemVariants()}
              >
                {navItems.map((item) => (
                  <MemoizedNavItem
                    key={item.name}
                    item={item}
                    isActive={activeSection === item.href}
                    isHovered={hoveredPath === item.href}
                    onHover={handleHover}
                    onLeave={handleLeave}
                    onClick={scrollToSection}
                  />
                ))}
              </motion.div>

              <motion.div 
                variants={createItemVariants()}
                className="flex items-center space-x-4 ml-6"
              >
                <ThemeToggle />
                <LanguageSwitcher />
                
                <motion.a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
                  whileHover={{ scale: HOVER_SCALE, y: HOVER_Y, transition: { duration: 0.2 } }}
                  whileTap={{ scale: ACTIVE_SCALE, transition: { duration: 0.1 } }}
                >
                  <Download className="w-4 h-4" />
                  <span>{data.resume}</span>
                </motion.a>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-3">
              <LanguageSwitcher />
              <ThemeToggle />
              
              <motion.button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASING_SMOOTH }}
              className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-border"
            >
              <div className="px-6 py-8 space-y-6">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="flex items-center space-x-4 w-full text-left py-3 px-4 rounded-lg hover:bg-muted transition-colors"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                  >
                    <span className="font-mono text-sm text-muted-foreground w-8">
                      {item.index}
                    </span>
                    <span className="text-xl font-medium text-foreground">
                      {item.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </LazyMotion>
  );
});

Navigation.displayName = 'Navigation';
export default Navigation;
