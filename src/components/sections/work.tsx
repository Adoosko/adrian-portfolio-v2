'use client';

import { LazyMotion, domAnimation, motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import { memo, useMemo, useRef } from 'react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
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
  image?: string;
}

interface WorkProps {
  data: {
    title: string;
    featured: string;
    no_projects: string;
    projects: Project[];
  };
}

// Jednoduché animácie
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

// Minimalistický Project Card
const ProjectCard = memo<{
  project: Project;
  featuredText: string;
}>(({ project, featuredText }) => (
  <div className="bg-card border border-border rounded-lg overflow-hidden">
    {/* Project Image */}
    <div className="aspect-video bg-muted relative">
      {project.image ? (
        <Image
          src={project.image}
          alt={project.title}
          width={400}
          height={225}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground text-sm">{project.title}</span>
        </div>
      )}
    </div>

    {/* Project Info */}
    <div className="p-6">
      <p className="text-sm text-muted-foreground mb-2">{featuredText}</p>
      <h3 className="text-xl font-medium mb-3">{project.title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{project.description}</p>

      {/* Technologies */}
      {project.technologies && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted rounded text-xs"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      <div className="flex gap-2">
        {project.links?.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-muted rounded hover:bg-muted/80 transition-colors"
          >
            <Github size={16} />
          </a>
        )}
        {(project.links?.live || project.links?.demo) && (
          <a
            href={project.links.live || project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-muted rounded hover:bg-muted/80 transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  </div>
));

ProjectCard.displayName = 'ProjectCard';

// Mobile Slider
const MobileSlider = memo<{
  projects: Project[];
  featuredText: string;
}>(({ projects, featuredText }) => (
  <Swiper
    modules={[Pagination]}
    spaceBetween={20}
    slidesPerView={1}
    pagination={{ clickable: true }}
    className="max-w-sm mx-auto"
  >
    {projects.map((project) => (
      <SwiperSlide key={project.id}>
        <ProjectCard project={project} featuredText={featuredText} />
      </SwiperSlide>
    ))}
  </Swiper>
));

MobileSlider.displayName = 'MobileSlider';

// Desktop Grid
const DesktopGrid = memo<{
  projects: Project[];
  featuredText: string;
}>(({ projects, featuredText }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {projects.map((project) => (
      <motion.div key={project.id} variants={fadeInUp}>
        <ProjectCard project={project} featuredText={featuredText} />
      </motion.div>
    ))}
  </div>
));

DesktopGrid.displayName = 'DesktopGrid';

// Hlavný Work komponent
const Work = memo<WorkProps>(({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const containerVariants = useMemo(() => staggerContainer, []);

  return (
    <LazyMotion features={domAnimation}>
      <section
        id="work"
        ref={containerRef}
        className="py-20 px-6 lg:px-20"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Section Header */}
            <motion.div variants={fadeInUp} className="mb-16 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-sm text-muted-foreground">02</span>
                <h2 className="text-3xl font-light">{data.title}</h2>
                <div className="flex-1 h-px bg-border" />
              </div>
            </motion.div>

            {/* Projects */}
            {data.projects.length > 0 ? (
              isMobile ? (
                <MobileSlider
                  projects={data.projects}
                  featuredText={data.featured}
                />
              ) : (
                <DesktopGrid
                  projects={data.projects}
                  featuredText={data.featured}
                />
              )
            ) : (
              <motion.div
                variants={fadeInUp}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">{data.no_projects}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </LazyMotion>
  );
});

Work.displayName = 'Work';

export default Work;
