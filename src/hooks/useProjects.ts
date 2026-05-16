"use client";

import { useEffect, useState } from "react";
import { Project } from "@/lib/store";
import {
  fetchProjects,
  createProject,
  updateProject as updateProjectDb,
  deleteProject as deleteProjectDb,
} from "@/lib/projects";

export function useProjects() {
  const [projects, setProjects]   = useState<Project[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProjects();
      setProjects(data);
    } catch (e) {
      setError("Failed to load projects.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function addProject(p: Omit<Project, "id" | "createdAt" | "updatedAt">) {
    try {
      const created = await createProject(p);
      setProjects(prev => [created, ...prev]);
      return created;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async function updateProject(id: string, updates: Partial<Project>) {
    try {
      const updated = await updateProjectDb(id, updates);
      setProjects(prev => prev.map(p => p.id === id ? updated : p));
      return updated;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async function removeProject(id: string) {
    try {
      await deleteProjectDb(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  return { projects, loading, error, addProject, updateProject, removeProject, reload: load };
}