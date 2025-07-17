'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { Download, Menu, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
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

export default function Navigation({ data }: NavigationProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navItems = [
    { name: data.about, href: '#about', index: '01' },
    { name: data.work, href: '#work', index: '02' },
    { name: data.contact, href: '#contact', index: '03' },
  ];

  useEffect(() => {
    setMounted(true);
    
    // Scroll detection
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Intersection Observer pre active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-20% 0px -80% 0px' }
    );

    // Attach scroll listener
    window.addEventListener('scroll', handleScroll);

    // Observe sections
    navItems.forEach((item) => {
      const element = document.getElementById(item.href.substring(1));
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMobileMenuOpen(false);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Server-side fallback
  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="text-xl lg:text-2xl font-mono font-semibold tracking-tight text-foreground">
              AF
            </div>
            <div className="hidden lg:flex items-center space-x-1">
              <div className="flex items-center space-x-1 relative bg-muted/50 rounded-xl p-1.5 border border-border/50">
                {navItems.map((item) => (
                  <div key={item.name} className="relative">
                    <button className="relative z-10 flex items-center space-x-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg">
                      <span className="font-mono text-xs">{item.index}</span>
                      <span className="tracking-wide">{item.name}</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-4 ml-6">
                <ThemeToggle />
                <LanguageSwitcher />
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{data.resume}</span>
                </a>
              </div>
            </div>
            <div className="lg:hidden flex items-center space-x-3">
              <LanguageSwitcher />
              <ThemeToggle />
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Client-side render
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-lg'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={scrollToTop}
            className="text-xl lg:text-2xl font-mono font-semibold tracking-tight text-foreground hover:scale-105 transition-transform"
          >
            AF
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <div className="flex items-center space-x-1 relative bg-muted/50 rounded-xl p-1.5 border border-border/50">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`relative z-10 flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200 rounded-lg hover:scale-105 ${
                      activeSection === item.href 
                        ? 'text-foreground bg-muted' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="font-mono text-xs">{item.index}</span>
                    <span className="tracking-wide">{item.name}</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4 ml-6">
              <ThemeToggle />
              <LanguageSwitcher />
              
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2.5 text-sm font-medium border border-border rounded-lg hover:bg-muted transition-colors hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>{data.resume}</span>
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <LanguageSwitcher />
            <ThemeToggle />
            
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label={isMobileMenuOpen ? "Zatvoriť menu" : "Otvoriť menu"}
  aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border">
          <div className="px-6 py-8 space-y-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="flex items-center space-x-4 w-full text-left py-3 px-4 rounded-lg hover:bg-muted transition-colors"
              >
                <span className="font-mono text-sm text-muted-foreground w-8">
                  {item.index}
                </span>
                <span className="text-xl font-medium text-foreground">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
