"use client";

import { useState } from "react";
import { useNexusStore, ProjectStatus, Project } from "@/lib/store";
import ProjectCard from "./ProjectCard";
import NewProjectModal from "./NewProjectModal";
import { Search, Plus, SlidersHorizontal } from "lucide-react";

const ALL_STATUSES: ProjectStatus[] = [
  "Idea", "Researching", "Planning", "Building",
  "Testing", "Deploying", "Live", "Maintaining", "Stalled", "Archived",
];

interface Props {
  onSelectProject: (p: Project) => void;
  onAddProject: (p: Omit<Project, "id" | "createdAt" | "updatedAt">) => Promise<unknown>;
}

export default function ProjectsView({ onSelectProject, onAddProject }: Props) {
  const { projects } = useNexusStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "All">("All");
  const [showModal, setShowModal] = useState(false);

  const filtered = projects.filter(p => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.stack.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <div style={{ height: "100%", overflowY: "auto" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "32px", fontWeight: 400, color: "var(--text-primary)" }}>
                Projects
              </h1>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "3px" }}>
                {projects.length} total · {filtered.length} shown
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "8px 16px", borderRadius: "8px",
                background: "var(--accent-blue)", border: "none",
                color: "white", cursor: "pointer",
                fontSize: "12px", fontFamily: "var(--font-mono)",
              }}
            >
              <Plus size={13} /> New Project
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{
              flex: 1, display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 12px", borderRadius: "8px",
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
            }}>
              <Search size={13} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search by name, stack, description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "var(--text-primary)", fontSize: "12px", fontFamily: "var(--font-mono)",
                }}
              />
            </div>
            <button style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 14px", borderRadius: "8px",
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              color: "var(--text-secondary)", cursor: "pointer",
              fontSize: "12px", fontFamily: "var(--font-mono)",
            }}>
              <SlidersHorizontal size={13} /> Filter
            </button>
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {(["All", ...ALL_STATUSES] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: "4px 12px", borderRadius: "20px",
                  background: filterStatus === status ? "var(--accent-blue)" : "var(--bg-elevated)",
                  color: filterStatus === status ? "white" : "var(--text-secondary)",
                  border: `1px solid ${filterStatus === status ? "var(--accent-blue)" : "var(--border)"}`,
                  cursor: "pointer", fontSize: "11px", fontFamily: "var(--font-mono)",
                  transition: "all 0.12s",
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              {filtered.map(project => (
                <ProjectCard key={project.id} project={project} onClick={() => onSelectProject(project)} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center", padding: "60px 0",
              borderRadius: "12px", border: "1px solid var(--border)",
              color: "var(--text-muted)", fontSize: "13px",
            }}>
              No projects match your search.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onAdd={onAddProject}
        />
      )}
    </>
  );
}