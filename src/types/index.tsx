import { ProjectImageKey } from "@/config/projectImages";

  
  // src/types/project.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  links: {
    github?: string;
    live?: string;
    demo?: string;
  };
  imageKey?: ProjectImageKey
  featured?: boolean;
}

export interface WorkData {
  title: string;
  featured: string;
  no_projects: string;
  projects: Project[];
}
