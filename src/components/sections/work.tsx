// src/components/work/Work.tsx
'use client';

import { projectImages } from '@/config/projectImages';
import { type Project, type WorkData } from '@/types';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';

// Univerzálny blur placeholder
const UNIVERSAL_BLUR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9ImJsdXIiIHg9IjAiIHk9IjAiPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgaW49IlNvdXJjZUdyYXBoaWMiIHN0ZERldmlhdGlvbj0iMTUiLz4KICAgIDwvZmlsdGVyPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIiBmaWx0ZXI9InVybCgjYmx1cikiLz4KPC9zdmc+";

interface WorkProps {
  data: WorkData;
}

const ProjectCard = memo<{ project: Project; featuredText: string }>(
  ({ project, featuredText }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    const imageSrc = project.imageKey ? projectImages[project.imageKey] : null;

    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
        <div className="aspect-video bg-muted relative overflow-hidden">
          {imageSrc && mounted ? (
            <Image
              src={imageSrc}
              alt={project.title}
              width={400}
              height={225}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              priority={false} // Explicitly disable preloading
              placeholder="blur"
              blurDataURL={UNIVERSAL_BLUR}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm font-mono">
                {project.title}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          {project.featured && (
            <p className="text-sm text-muted-foreground mb-2 font-mono">
              {featuredText}
            </p>
          )}
          
          <h3 className="text-xl font-medium mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
            {project.description}
          </p>

          {project.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-muted rounded text-xs font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-muted rounded hover:bg-muted/80 transition-colors"
                aria-label={`View ${project.title} on GitHub`}
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
                aria-label={`View ${project.title} live demo`}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ProjectCard.displayName = 'ProjectCard';

const Work = memo<WorkProps>(({ data }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-light">{data.title}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="py-20 px-6 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-sm text-muted-foreground font-mono">02</span>
            <h2 className="text-3xl font-light">{data.title}</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
        </div>

        {data.projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                featuredText={data.featured}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{data.no_projects}</p>
          </div>
        )}
      </div>
    </section>
  );
});

Work.displayName = 'Work';

export default Work;
