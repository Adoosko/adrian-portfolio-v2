'use client';

import { ArrowUp, ExternalLink, Github, Linkedin, Mail } from 'lucide-react';
import { LazyMotion, domAnimation, m } from 'motion/react';
import {
  memo,
  useCallback,
  useMemo,
  type ComponentType
} from 'react';

// Optimalizované typy
interface SocialLink {
  name: string;
  href: string;
  icon: ComponentType<{ size?: number }>;
}

interface FooterProps {
  data: {
    description: string;
    navigation: string;
    connect: string;
    rights_reserved: string;
    built_with: string;
    back_to_top: string;
  };
  nav: {
    about: string;
    work: string;
    contact: string;
    resume: string;
  };
}

// Konstanty mimo komponentu
const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    href: 'https://github.com/Adoosko',
    icon: Github,
  },
  {
    name: 'LinkedIn', 
    href: 'https://www.linkedin.com/in/adrián-finik-26694536b',
    icon: Linkedin,
  },
  {
    name: 'Email',
    href: 'mailto:adoosdeveloper@gmail.com', 
    icon: Mail,
  },
];

// Memoizované sub-komponenty s m komponentom
const ScrollToTopButton = memo<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}>(({ onClick, children, className }) => (
  <m.button
    onClick={onClick}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    transition={{ duration: 0.2 }}
    className={className}
  >
    {children}
  </m.button>
));

ScrollToTopButton.displayName = 'ScrollToTopButton';

const NavigationLink = memo<{
  onClick: () => void;
  children: React.ReactNode;
}>(({ onClick, children }) => (
  <m.button
    onClick={onClick}
    whileHover={{ x: 4 }}
    transition={{ duration: 0.2 }}
    className="block text-muted-foreground hover:text-foreground transition-colors text-left"
  >
    {children}
  </m.button>
));

NavigationLink.displayName = 'NavigationLink';

const SocialButton = memo<{
  href: string;
  icon: ComponentType<{ size?: number }>;
  name: string;
}>(({ href, icon: Icon, name }) => (
  <m.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.9 }}
    transition={{ duration: 0.2 }}
    className="p-3 bg-muted rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    aria-label={name}
  >
    <Icon size={20} />
  </m.a>
));

SocialButton.displayName = 'SocialButton';

// Optimalizovaný hlavný Footer komponent
const Footer = memo<FooterProps>(({ data, nav }) => {
  // Memoizované navigation links
  const navLinks = useMemo(() => [
    { name: nav.about, href: '#about' },
    { name: nav.work, href: '#work' },
    { name: nav.contact, href: '#contact' },
  ], [nav.about, nav.work, nav.contact]);

  // Optimalizované scroll handlers
  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Memoizované current year
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Memoizované animácie
  const arrowAnimation = useMemo(() => ({
    y: [0, -2, 0],
    transition: { duration: 2, repeat: Infinity }
  }), []);

  return (
    <LazyMotion features={domAnimation}>
      <footer className="bg-background border-t border-border w-full">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* Logo & Description */}
            <div className="space-y-6">
              <ScrollToTopButton
                onClick={scrollToTop}
                className="text-2xl font-mono font-bold text-foreground hover:text-muted-foreground transition-colors"
              >
                AF
              </ScrollToTopButton>
              <p className="text-muted-foreground leading-relaxed max-w-xs">
                {data.description}
              </p>
            </div>

            {/* Navigation Links */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
                {data.navigation}
              </h3>
              <nav className="space-y-3">
                {navLinks.map((link) => (
                  <NavigationLink
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                  >
                    {link.name}
                  </NavigationLink>
                ))}
                <m.a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={nav.resume}
                >
                  <span>{nav.resume}</span>
                  <ExternalLink size={14} />
                </m.a>
              </nav>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
                {data.connect}
              </h3>
              <div className="flex space-x-4">
                {SOCIAL_LINKS.map((social) => (
                  <SocialButton
                    key={social.name}
                    href={social.href}
                    icon={social.icon}
                    name={social.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Full Width ADRIANFINIK Section */}
        <div className="border-t border-border bg-muted/30">
          <div className="py-12">
            {/* Large ADRIANFINIK Text */}
            <m.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <ScrollToTopButton
                onClick={scrollToTop}
                className="text-3xl sm:text-4xl md:text-6xl font-serif lg:text-9xl font-bold tracking-widest uppercase text-foreground cursor-pointer select-none hover:text-muted-foreground transition-colors"
              >
                ADRIANFINIK.
              </ScrollToTopButton>
            </m.div>

            {/* Copyright & Back to Top */}
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-sm text-muted-foreground">
                  © {currentYear} Adrian Finik. {data.rights_reserved}
                </p>

                <div className="flex items-center space-x-6">
                  <span className="text-sm text-muted-foreground">
                    {data.built_with}
                  </span>
                  <m.button
                    onClick={scrollToTop}
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <span>{data.back_to_top}</span>
                    <m.div animate={arrowAnimation}>
                      <ArrowUp size={14} />
                    </m.div>
                  </m.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </LazyMotion>
  );
});

Footer.displayName = 'Footer';

export default Footer;
