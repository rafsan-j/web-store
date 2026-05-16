"use client";

import { useNexusStore } from "@/lib/store";
import ProjectCard from "./ProjectCard";
import { FolderKanban, Rocket, AlertTriangle, TrendingUp, Sparkles, Clock } from "lucide-react";

export default function Dashboard({ onSelectProject }: { onSelectProject: (p: import("@/lib/store").Project) => void }) {
  const { projects } = useNexusStore();

  const liveProjects    = projects.filter(p => p.status === "Live");
  const activeProjects  = projects.filter(p => ["Building", "Testing", "Deploying"].includes(p.status));
  const stalledProjects = projects.filter(p => p.status === "Stalled");
  const avgHealth       = Math.round(projects.reduce((a, p) => a + p.healthScore, 0) / projects.length);

  const stats = [
    { label: "Total Projects", value: projects.length,        icon: FolderKanban,  color: "#4f8ef7" },
    { label: "Live",           value: liveProjects.length,    icon: Rocket,        color: "#34d399" },
    { label: "Stalled",        value: stalledProjects.length, icon: AlertTriangle, color: "#f87171" },
    { label: "Avg Health",     value: `${avgHealth}%`,        icon: TrendingUp,    color: "#8b5cf6" },
  ];

  const priorityProjects = [...projects]
    .sort((a, b) => b.healthScore - a.healthScore)
    .slice(0, 4);

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "32px" }}>

        {/* Header */}
        <div>
          <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "36px", color: "var(--text-primary)", lineHeight: 1.1, fontWeight: 400 }}>
            Good {getTimeOfDay()}, Developer
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "6px" }}>
            You have {activeProjects.length} active project{activeProjects.length !== 1 ? "s" : ""} in progress.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={{
                borderRadius: "12px",
                padding: "20px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Icon size={15} color={stat.color} />
                  <span style={{ fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    {stat.label}
                  </span>
                </div>
                <p style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "32px",
                  color: "var(--text-primary)",
                  lineHeight: 1,
                  fontWeight: 400,
                }}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* AI Insight */}
        <div style={{
          borderRadius: "12px",
          padding: "16px 20px",
          background: "linear-gradient(135deg, rgba(79,142,247,0.07), rgba(139,92,246,0.07))",
          border: "1px solid rgba(79,142,247,0.18)",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
        }}>
          <Sparkles size={15} color="#4f8ef7" style={{ marginTop: "2px", flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: "10px", fontWeight: 600, color: "#4f8ef7", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
              AI Insight
            </p>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Portfolio v2</span> has been stalled for 20+ days.
              Consider breaking it into smaller milestones or archiving it to reduce cognitive load.
            </p>
          </div>
        </div>

        {/* Priority Projects */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Clock size={13} color="var(--text-muted)" />
            <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Priority Projects
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            {priorityProjects.map(project => (
  <ProjectCard key={project.id} project={project} onClick={() => onSelectProject(project)} />
))}
          </div>
        </div>

      </div>
    </div>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}