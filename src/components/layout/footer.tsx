//@ts-nocheck
"use client";

import { motion } from "framer-motion";
import { ArrowUp, ExternalLink, Github, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/Adoosko",
    icon: Github,
  },
  {
    name: "LinkedIn", 
    href: "www.linkedin.com/in/adrián-finik-26694536b",
    icon: Linkedin,
  },
  {
    name: "Email",
    href: "mailto:adoosdeveloper@gmail.com", 
    icon: Mail,
  },
];

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

export function Footer({ data, nav }: FooterProps) {
  const navLinks = [
    { name: nav.about, href: "#about" },
    { name: nav.work, href: "#work" },
    { name: nav.contact, href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-background border-t border-border w-full">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Logo & Description */}
          <div className="space-y-6">
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-mono font-bold text-foreground hover:text-muted-foreground transition-colors"
            >
              AF
            </motion.button>
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
                <motion.button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  whileHover={{ x: 4 }}
                  className="block text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  {link.name}
                </motion.button>
              ))}
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 4 }}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={nav.resume}
              >
                <span>{nav.resume}</span>
                <ExternalLink size={14} />
              </motion.a>
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
              {data.connect}
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-muted rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    aria-label={social.name}
                  >
                    <Icon size={20} />
                  </motion.a>
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
          <motion.div
            className="text-center mb-8"
            
            transition={{ duration: 0.3 }}
          >
            <motion.h2
              onClick={scrollToTop}
              className="text-3xl sm:text-4xl relative md:text-6xl font-serif lg:text-9xl font-bold tracking-widest uppercase text-foreground cursor-pointer select-none"
              
             
            >
              ADRIANFINIK.
            </motion.h2>
          </motion.div>

          {/* Copyright & Back to Top */}
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Adrian Finik. {data.rights_reserved}
              </p>

              <div className="flex items-center space-x-6">
                <span className="text-sm text-muted-foreground">
                  {data.built_with}
                </span>
                <motion.button
                  onClick={scrollToTop}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <span>{data.back_to_top}</span>
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowUp size={14} />
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
