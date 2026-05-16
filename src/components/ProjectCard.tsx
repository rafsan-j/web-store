"use client";

import { Project } from "@/lib/store";
import StatusBadge from "./StatusBadge";
import { ExternalLink, GitBranch, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const priorityColor: Record<string, string> = {
  Low:      "#34d399",
  Medium:   "#4f8ef7",
  High:     "#fbbf24",
  Critical: "#f87171",
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const health = project.healthScore;
  const healthColor = health >= 75 ? "#34d399" : health >= 50 ? "#fbbf24" : "#f87171";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "12px",
        padding: "18px 18px 18px 22px",
        background: hovered ? "var(--bg-overlay)" : "var(--bg-elevated)",
        border: `1px solid ${hovered ? "var(--border-hover)" : "var(--border)"}`,
        cursor: "pointer",
        transition: "all 0.15s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Priority left bar */}
      <div style={{
        position: "absolute",
        left: 0, top: "14px", bottom: "14px",
        width: "3px",
        borderRadius: "0 2px 2px 0",
        background: priorityColor[project.priority],
        opacity: 0.8,
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "6px" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "15px",
            color: "var(--text-primary)",
            fontWeight: 400,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {project.title}
          </h3>
          <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "1px", letterSpacing: "0.04em" }}>
            {project.category}
          </p>
        </div>
        <button
          onClick={e => e.stopPropagation()}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-muted)", padding: "2px",
            opacity: hovered ? 1 : 0, transition: "opacity 0.15s",
          }}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Description */}
      <p style={{
        fontSize: "12px",
        color: "var(--text-secondary)",
        lineHeight: 1.6,
        marginBottom: "12px",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {project.description}
      </p>

      {/* Stack tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "14px" }}>
        {project.stack.slice(0, 3).map(tech => (
          <span key={tech} style={{
            fontSize: "10px",
            padding: "2px 7px",
            borderRadius: "4px",
            background: "rgba(255,255,255,0.04)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            letterSpacing: "0.02em",
          }}>
            {tech}
          </span>
        ))}
        {project.stack.length > 3 && (
          <span style={{ fontSize: "10px", color: "var(--text-muted)", padding: "2px 4px" }}>
            +{project.stack.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <StatusBadge status={project.status} />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Health bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "44px", height: "3px", borderRadius: "2px",
              background: "rgba(255,255,255,0.08)", overflow: "hidden",
            }}>
              <div style={{ width: `${health}%`, height: "100%", background: healthColor, borderRadius: "2px" }} />
            </div>
            <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{health}</span>
          </div>
          {/* Links */}
          <div style={{ display: "flex", gap: "2px", opacity: hovered ? 1 : 0, transition: "opacity 0.15s" }}>
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ color: "var(--text-muted)", padding: "3px", display: "flex" }}>
                <GitBranch size={12} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ color: "var(--text-muted)", padding: "3px", display: "flex" }}>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}