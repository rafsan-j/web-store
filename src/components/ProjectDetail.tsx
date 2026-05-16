"use client";

import { useState } from "react";
import { Project } from "@/lib/store";
import StatusBadge from "./StatusBadge";
import EditProjectModal from "./EditProjectModal";
import {
  X, GitBranch, ExternalLink, Globe, Lock,
  Calendar, Activity, Trash2, Edit3,
} from "lucide-react";

interface Props {
  project: Project;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updates: Partial<Project>) => Promise<unknown>;
}

const priorityColor: Record<string, string> = {
  Low: "#34d399", Medium: "#4f8ef7", High: "#fbbf24", Critical: "#f87171",
};

export default function ProjectDetail({ project, onClose, onDelete, onUpdate }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const health = project.healthScore;
  const healthColor = health >= 75 ? "#34d399" : health >= 50 ? "#fbbf24" : "#f87171";

  const handleDelete = async () => {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try { await onDelete(project.id); } finally { setDeleting(false); }
  };

  return (
    <>
      <div style={{
        width: "380px", minWidth: "380px", height: "100%",
        background: "var(--bg-surface)", borderLeft: "1px solid var(--border)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{
                fontFamily: "'Instrument Serif', serif", fontSize: "20px",
                fontWeight: 400, color: "var(--text-primary)", lineHeight: 1.2,
              }}>
                {project.title}
              </h2>
              <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "3px", letterSpacing: "0.04em" }}>
                {project.category} · {project.slug}
              </p>
            </div>
            <button onClick={onClose} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", padding: "4px", display: "flex",
              borderRadius: "6px", flexShrink: 0,
            }}>
              <X size={15} />
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <StatusBadge status={project.status} />
            <span style={{
              fontSize: "10px", padding: "2px 8px", borderRadius: "20px",
              background: `${priorityColor[project.priority]}18`,
              color: priorityColor[project.priority],
              border: `1px solid ${priorityColor[project.priority]}30`,
            }}>{project.priority} priority</span>
            <span style={{
              fontSize: "10px", padding: "2px 8px", borderRadius: "20px",
              background: "var(--glass)", color: "var(--text-muted)",
              border: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: "4px",
            }}>
              {project.visibility === "public" ? <Globe size={9} /> : <Lock size={9} />}
              {project.visibility}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

          <Section label="Description">
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {project.description || "No description added."}
            </p>
          </Section>

          <Section label="Health Score">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                flex: 1, height: "6px", borderRadius: "3px",
                background: "rgba(255,255,255,0.06)", overflow: "hidden",
              }}>
                <div style={{
                  width: `${health}%`, height: "100%",
                  background: healthColor, borderRadius: "3px",
                  transition: "width 0.4s ease",
                }} />
              </div>
              <span style={{
                fontSize: "18px", fontFamily: "'Instrument Serif', serif",
                color: healthColor, minWidth: "40px",
              }}>
                {health}
              </span>
            </div>
          </Section>

          <Section label="Tech Stack">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {project.stack.length > 0 ? project.stack.map(tech => (
                <span key={tech} style={{
                  fontSize: "11px", padding: "3px 9px", borderRadius: "5px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)", color: "var(--text-secondary)",
                }}>{tech}</span>
              )) : (
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>No stack added.</span>
              )}
            </div>
          </Section>

          <Section label="Links">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {project.repoUrl ? (
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  fontSize: "12px", color: "var(--accent-blue)", textDecoration: "none",
                  padding: "8px 10px", borderRadius: "8px",
                  background: "rgba(79,142,247,0.07)", border: "1px solid rgba(79,142,247,0.15)",
                }}>
                  <GitBranch size={13} /> Repository
                  <ExternalLink size={11} style={{ marginLeft: "auto", opacity: 0.5 }} />
                </a>
              ) : (
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>No repo linked.</p>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  fontSize: "12px", color: "var(--accent-green)", textDecoration: "none",
                  padding: "8px 10px", borderRadius: "8px",
                  background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.15)",
                }}>
                  <Globe size={13} /> Live Site
                  <ExternalLink size={11} style={{ marginLeft: "auto", opacity: 0.5 }} />
                </a>
              )}
            </div>
          </Section>

          <Section label="Timeline">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <MetaRow icon={<Calendar size={12} />} label="Created">
                {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </MetaRow>
              <MetaRow icon={<Activity size={12} />} label="Last Updated">
                {new Date(project.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </MetaRow>
            </div>
          </Section>

        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 20px", borderTop: "1px solid var(--border)",
          display: "flex", gap: "8px", flexShrink: 0,
        }}>
          <button
            onClick={() => setShowEdit(true)}
            style={{
              flex: 1, padding: "8px", borderRadius: "8px",
              background: "var(--glass-hover)", border: "1px solid var(--border)",
              color: "var(--text-secondary)", cursor: "pointer",
              fontSize: "11px", fontFamily: "var(--font-mono)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            }}
          >
            <Edit3 size={12} /> Edit
          </button>
          <button
            onClick={() => void handleDelete()}
            disabled={deleting}
            style={{
              padding: "8px 14px", borderRadius: "8px",
              background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
              color: "#f87171", cursor: deleting ? "not-allowed" : "pointer",
              fontSize: "11px", fontFamily: "var(--font-mono)",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            <Trash2 size={12} /> {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {showEdit && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEdit(false)}
          onSave={onUpdate}
        />
      )}
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <p style={{
        fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase",
        color: "var(--text-muted)", marginBottom: "10px", fontWeight: 500,
      }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function MetaRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ color: "var(--text-muted)" }}>{icon}</span>
      <span style={{ fontSize: "11px", color: "var(--text-muted)", minWidth: "90px" }}>{label}</span>
      <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{children}</span>
    </div>
  );
}