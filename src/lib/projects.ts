import { supabase, DbProject } from "./supabase";
import { Project } from "./store";

export function toProject(row: DbProject): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    category: row.category as Project["category"],
    status: row.status as Project["status"],
    priority: row.priority as Project["priority"],
    visibility: row.visibility as Project["visibility"],
    stack: row.stack ?? [],
    repoUrl: row.repo_url,
    liveUrl: row.live_url,
    healthScore: row.health_score,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toRow(p: Partial<Project>) {
  return {
    ...(p.title       !== undefined && { title: p.title }),
    ...(p.slug        !== undefined && { slug: p.slug }),
    ...(p.description !== undefined && { description: p.description }),
    ...(p.category    !== undefined && { category: p.category }),
    ...(p.status      !== undefined && { status: p.status }),
    ...(p.priority    !== undefined && { priority: p.priority }),
    ...(p.visibility  !== undefined && { visibility: p.visibility }),
    ...(p.stack       !== undefined && { stack: p.stack }),
    ...(p.repoUrl     !== undefined && { repo_url: p.repoUrl }),
    ...(p.liveUrl     !== undefined && { live_url: p.liveUrl }),
    ...(p.healthScore !== undefined && { health_score: p.healthScore }),
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects_for_web_store")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as DbProject[]).map(toProject);
}

export async function createProject(
  p: Omit<Project, "id" | "createdAt" | "updatedAt">
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects_for_web_store")
    .insert(toRow(p))
    .select()
    .single();

  if (error) throw error;
  return toProject(data as DbProject);
}

export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects_for_web_store")
    .update(toRow(updates))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return toProject(data as DbProject);
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from("projects_for_web_store")
    .delete()
    .eq("id", id);

  if (error) throw error;
}