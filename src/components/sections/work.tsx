//@ts-nocheck
"use client";

import { motion, useMotionValue, useScroll, useSpring } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { EffectCards, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  links: {
    github?: string;
    live?: string;
    demo?: string;
  };
  image?: {
    light: string;
    dark: string;
  };
  video?: string;
}

interface WorkProps {
  data: {
    title: string;
    featured: string;
    no_projects: string;
    projects: Project[];
  };
}

// Professional easing functions
const customEasing = {
  dramatic: [0.22, 1, 0.36, 1],
  smooth: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
};

export function Work({ data }: WorkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentProject, setCurrentProject] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Mouse tracking for 3D effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mouse tracking
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (event.clientX - centerX) / rect.width;
    const y = (event.clientY - centerY) / rect.height;
    
    mouseX.set(x * 10);
    mouseY.set(y * 5);
  };

  // Navigation functions
  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % data.projects.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + data.projects.length) % data.projects.length);
  };

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Header variants
  const headerVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 1,
        ease: customEasing.dramatic,
      },
    },
  };

  return (
    <section 
      id="work" 
      ref={containerRef}
      className="py-20 px-6 lg:px-20 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Enhanced Section Header */}
          <motion.div
            variants={headerVariants}
            className="mb-16"
            style={{
              rotateX: smoothMouseY,
              rotateY: smoothMouseX,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="flex items-center space-x-6 mb-4 group">
              <motion.span 
                className="font-mono text-sm text-muted-foreground"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                02
              </motion.span>
              
              <motion.h2 
                className="text-2xl lg:text-3xl font-light text-foreground relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {data.title}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.h2>
              
              <motion.div 
                className="flex-1 h-px bg-gradient-to-r from-border via-blue-500/50 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Projects Display */}
          {data.projects.length > 0 ? (
            isMobile ? (
              <MobileProjectSlider 
                projects={data.projects}
                currentProject={currentProject}
                setCurrentProject={setCurrentProject}
                featuredText={data.featured}
              />
            ) : (
              <DesktopProjectGallery 
                projects={data.projects}
                scrollProgress={scrollYProgress}
                featuredText={data.featured}
                mouseX={smoothMouseX}
                mouseY={smoothMouseY}
              />
            )
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-muted-foreground">{data.no_projects}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

interface MobileSliderProps {
  projects: Project[];
  featuredText: string;
  currentProject: number;
  setCurrentProject: (index: number) => void;
}

function MobileProjectSlider({ projects, featuredText, currentProject, setCurrentProject }: MobileSliderProps) {
  const { theme } = useTheme();

  return (
    <div className="relative">
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards, Pagination]}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-muted-foreground/30',
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-foreground',
        }}
        className="w-[90vw] sm:max-w-sm mx-auto"
        cardsEffect={{
          perSlideOffset: 8,
          perSlideRotate: 2,
          rotate: true,
          slideShadows: false,
        }}
      >
        {projects.map((project, index) => (
          <SwiperSlide key={project.id}>
            <ProjectCard 
              project={project} 
              featuredText={featuredText}
              theme={theme}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

// Separátny ProjectCard komponent
function ProjectCard({ project, featuredText, theme }: {
  project: Project;
  featuredText: string;
  theme: string | undefined;
}) {
  return (
    <motion.div
      className="bg-card border border-border rounded-lg overflow-hidden h-full"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Project Image */}
      <div className="aspect-video bg-muted relative overflow-hidden">
        {project.video ? (
          <video
            src={project.video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : project.image ? (
          <img
            src={theme === "dark" ? project.image.dark : project.image.light}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground font-mono text-sm">
              {project.title}
            </span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Project Info */}
      <div className="p-6 space-y-4">
        <div>
          <p className="font-mono text-sm text-muted-foreground mb-2">
            {featuredText}
          </p>
          <h3 className="text-xl font-medium text-foreground mb-3">
            {project.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            {project.description}
          </p>
        </div>

        {/* Technologies */}
        {project.technologies && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted rounded-full font-mono text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex space-x-3 pt-2">
          {project.links?.github && (
            <motion.a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={16} />
            </motion.a>
          )}
          {(project.links?.live || project.links?.demo) && (
            <motion.a
              href={project.links.live || project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink size={16} />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}


// Desktop Gallery Component
interface DesktopGalleryProps {
  projects: Project[];
  scrollProgress: any;
  featuredText: string;
  mouseX: any;
  mouseY: any;
}

function DesktopProjectGallery({ projects, scrollProgress, featuredText, mouseX, mouseY }: DesktopGalleryProps) {
  const { theme } = useTheme();
  return (
    <div className="space-y-24">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.2,
            ease: customEasing.dramatic 
          }}
          className={`grid lg:grid-cols-12 gap-12 items-center ${
            index % 2 === 1 ? "lg:text-right" : ""
          }`}
        >
          {/* Project Image with 3D effects */}
          <motion.div
            className={`lg:col-span-7 ${
              index % 2 === 1 ? "lg:order-2" : ""
            }`}
            style={{
              rotateX: mouseY,
              rotateY: mouseX,
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div 
              className="relative group cursor-pointer"
              whileHover={{ 
                scale: 1.02,
                rotateY: index % 2 === 1 ? -5 : 5,
                z: 50
              }}
              transition={{ duration: 0.4, ease: customEasing.smooth }}
            >
              <div className="aspect-video bg-muted rounded-lg border border-border overflow-hidden relative">
                {project.video ? (
                  <video
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : project.image ? (
                  <img
                    src={
                      theme === "dark"
                        ? project.image.dark
                        : project.image.light
                    }
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground font-mono text-sm">
                      {project.title}
                    </span>
                  </div>
                )}
                
                {/* Gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
                
                {/* Floating action buttons */}
                <motion.div
                  className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100"
                  initial={{ y: -20 }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {project.links?.github && (
                    <motion.a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-background/80 backdrop-blur-sm rounded-lg text-foreground shadow-lg"
                    >
                      <Github size={16} />
                    </motion.a>
                  )}
                  {(project.links?.live || project.links?.demo) && (
                    <motion.a
                      href={project.links.live || project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-background/80 backdrop-blur-sm rounded-lg text-foreground shadow-lg"
                    >
                      <ExternalLink size={16} />
                    </motion.a>
                  )}
                </motion.div>
              </div>

              {/* 3D shadow */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg blur-xl -z-10"
                style={{
                  transform: "translateZ(-20px) translateX(8px) translateY(8px)",
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Project Info */}
          <motion.div
            className={`lg:col-span-5 space-y-6 ${
              index % 2 === 1 ? "lg:order-1" : ""
            }`}
            initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div>
              <motion.p 
                className="font-mono text-sm text-muted-foreground mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {featuredText}
              </motion.p>
              <motion.h3 
                className="text-2xl lg:text-3xl font-medium text-foreground mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {project.title}
              </motion.h3>
            </div>

            <motion.div 
              className="bg-card p-6 rounded-lg border border-border relative overflow-hidden"
              whileHover={{ scale: 1.02, rotateY: 2 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <p className="text-muted-foreground leading-relaxed relative z-10">
                {project.description}
              </p>
            </motion.div>

            {/* Technologies with stagger animation */}
            {project.technologies && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.5,
                    },
                  },
                }}
                className={`flex flex-wrap gap-3 ${
                  index % 2 === 1 ? "lg:justify-end" : ""
                }`}
              >
                {project.technologies.map((tech, techIndex) => (
                  <motion.span
                    key={techIndex}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.8 },
                      visible: { opacity: 1, y: 0, scale: 1 },
                    }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-3 py-1 bg-muted rounded-full font-mono text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
