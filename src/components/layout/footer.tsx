'use client';

import { ArrowUp, ExternalLink, Github, Linkedin, Mail } from 'lucide-react';
import { useCallback, useMemo } from 'react';

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

const SOCIAL_LINKS = [
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

export default function Footer({ data, nav }: FooterProps) {
  const navLinks = useMemo(() => [
    { name: nav.about, href: '#about' },
    { name: nav.work, href: '#work' },
    { name: nav.contact, href: '#contact' },
  ], [nav.about, nav.work, nav.contact]);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="bg-background border-t border-border w-full">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Logo & Description */}
          <div className="space-y-6">
            <button
              onClick={scrollToTop}
              className="text-2xl font-mono font-bold text-foreground hover:text-muted-foreground transition-colors"
            >
              AF
            </button>
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
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="block text-muted-foreground hover:text-foreground transition-colors text-left hover:translate-x-1 transition-transform"
                >
                  {link.name}
                </button>
              ))}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 transition-transform"
                aria-label={nav.resume}
              >
                <span>{nav.resume}</span>
                <ExternalLink size={14} />
              </a>
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
              {data.connect}
            </h3>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-muted rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors hover:scale-110 hover:-translate-y-1 transition-transform"
                    aria-label={social.name}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Full Width ADRIANFINIK Section */}
      <div className="border-t border-border bg-muted/30">
        <div className="py-12">
          {/* Large ADRIANFINIK Text */}
          <div className="text-center mb-8">
            <button
              onClick={scrollToTop}
              className="text-3xl sm:text-4xl md:text-6xl font-serif lg:text-9xl font-bold tracking-widest uppercase text-foreground cursor-pointer select-none hover:text-muted-foreground transition-colors"
            >
              ADRIANFINIK.
            </button>
          </div>

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
                <button
                  onClick={scrollToTop}
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group hover:-translate-y-1 transition-transform"
                >
                  <span>{data.back_to_top}</span>
                  <ArrowUp size={14} className="group-hover:animate-bounce" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
