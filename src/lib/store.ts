import { create } from "zustand";

export type ProjectStatus =
  | "Idea" | "Researching" | "Planning" | "Building"
  | "Testing" | "Deploying" | "Live" | "Maintaining"
  | "Stalled" | "Archived";

export type ProjectCategory =
  | "SaaS" | "AI Tool" | "PWA" | "Experiment"
  | "Research" | "Portfolio" | "Automation" | "Other";

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  priority: "Low" | "Medium" | "High" | "Critical";
  visibility: "public" | "private";
  stack: string[];
  repoUrl?: string;
  liveUrl?: string;
  createdAt: string;
  updatedAt: string;
  healthScore: number;
}

interface NexusStore {
  projects: Project[];
  activeProjectId: string | null;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useNexusStore = create<NexusStore>((set) => ({
  projects: [],
  activeProjectId: null,
  sidebarOpen: true,
  commandPaletteOpen: false,
  setProjects: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({
      projects: [
        {
          ...project,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...state.projects,
      ],
    })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),
  setActiveProject: (id) => set({ activeProjectId: id }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));