'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Palette, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

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

export default function Hero({ data }: HeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen flex mt-30 lg:mt-5 items-center justify-center px-4 sm:px-6 lg:px-20">
      {/* Minimal Grid Background */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 border border-border rounded-full">
              <div className="w-2 h-2 bg-foreground rounded-full" />
              <span className="text-sm font-medium text-muted-foreground">
                {data.greeting}
              </span>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif text-foreground leading-tight tracking-tight">
                {data.title}
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-light text-muted-foreground leading-tight">
                {data.subtitle}
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {data.description}
            </p>

            {/* Minimalist Feature List */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Code size={16} className="text-foreground" />
                <span>Full Stack Development</span>
              </div>
              <div className="flex items-center space-x-2">
                <Palette size={16} className="text-foreground" />
                <span>Clean UI Design</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap size={16} className="text-foreground" />
                <span>Performance Focus</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
  {/* Primary CTA Button */}
  <Button
    onClick={() => scrollToSection('work')}
    size="lg"
    className="group relative bg-foreground text-background hover:bg-foreground/90 px-8 py-6 text-lg font-medium tracking-wide transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label={`View my work section - ${data.ctaText}`}
  >
    <span className="flex items-center justify-center space-x-2">
      <span>{data.ctaText}</span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
    </span>
  </Button>

  {/* Secondary CTA Button */}
  <Button
    onClick={() => scrollToSection('contact')}
    variant="outline"
    size="lg"
    className="group relative border-2 border-foreground text-foreground hover:bg-foreground hover:text-background dark:hover:text-white px-8 py-6 text-lg font-medium tracking-wide transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label={`Contact me - ${data.cta2Text}`}
  >
    <span className="group-hover:scale-105 transition-transform duration-200">
      {data.cta2Text}
    </span>
  </Button>
</div>
          </div>

          {/* Right Visual Content */}
          <div className="relative">
            {/* Main Terminal Card */}
            <div className="relative bg-background border-2 border-border rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-500">
              {/* Terminal Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <div className="w-3 h-3 bg-destructive rounded-full" />
                  <div className="w-3 h-3 bg-foreground rounded-full" />
                </div>
                <div className="text-xs text-muted-foreground font-mono mr-10">
                  adrian-finik.ts
                </div>
              </div>

              {/* Code Content */}
              <div className="space-y-3 font-mono text-sm">
                <div className="text-muted-foreground">
                  <span className="text-foreground">const</span> developer = {"{"}
                </div>
                <div className="pl-4 space-y-2 text-muted-foreground">
                  <div><span className="text-foreground">name:</span> "Adrian Finik",</div>
                  <div><span className="text-foreground">role:</span> "Full Stack Developer",</div>
                  <div><span className="text-foreground">skills:</span> ["React", "Next.js", "TypeScript"],</div>
                  <div><span className="text-foreground">philosophy:</span> "Less is more",</div>
                  <div><span className="text-foreground">available:</span> true</div>
                </div>
                <div className="text-muted-foreground">{"}"}</div>
              </div>

              {/* Cursor */}
              <div className="flex items-center mt-4 text-muted-foreground font-mono text-sm">
                <span>$</span>
                <div className="w-2 h-4 bg-foreground ml-2 animate-pulse" />
              </div>
            </div>

            {/* Floating Stats - Minimal */}
            <div className="absolute -top-4 -right-4 bg-background border-2 border-border rounded-lg p-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">2+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Years</div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-background border-2 border-border rounded-lg p-4 shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">10+</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
