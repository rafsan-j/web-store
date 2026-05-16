"use client";

import { useNexusStore } from "@/lib/store";
import StatusBadge from "./StatusBadge";
import { Activity, Clock, FolderKanban, TrendingUp, AlertTriangle } from "lucide-react";

export default function ActivityFeed() {
  const { projects } = useNexusStore();

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const stalledProjects  = projects.filter(p => p.status === "Stalled");
  const healthyProjects  = projects.filter(p => p.healthScore >= 75);
  const criticalProjects = projects.filter(p => p.priority === "Critical");

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "28px" }}>

        {/* Header */}
        <div>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "32px", fontWeight: 400, color: "var(--text-primary)",
          }}>
            Activity Feed
          </h1>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
            Live overview of your workspace activity
          </p>
        </div>

        {/* Alert cards */}
        {(stalledProjects.length > 0 || criticalProjects.length > 0) && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {stalledProjects.length > 0 && (
              <div style={{
                padding: "14px 18px", borderRadius: "10px",
                background: "rgba(248,113,113,0.07)",
                border: "1px solid rgba(248,113,113,0.2)",
                display: "flex", alignItems: "center", gap: "10px",
              }}>
                <AlertTriangle size={14} color="#f87171" />
                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  <span style={{ color: "#f87171", fontWeight: 500 }}>
                    {stalledProjects.length} project{stalledProjects.length > 1 ? "s" : ""}
                  </span>{" "}
                  stalled — {stalledProjects.map(p => p.title).join(", ")}
                </p>
              </div>
            )}
            {criticalProjects.length > 0 && (
              <div style={{
                padding: "14px 18px", borderRadius: "10px",
                background: "rgba(251,191,36,0.07)",
                border: "1px solid rgba(251,191,36,0.2)",
                display: "flex", alignItems: "center", gap: "10px",
              }}>
                <TrendingUp size={14} color="#fbbf24" />
                <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  <span style={{ color: "#fbbf24", fontWeight: 500 }}>
                    {criticalProjects.length} critical
                  </span>{" "}
                  priority project{criticalProjects.length > 1 ? "s" : ""} — {criticalProjects.map(p => p.title).join(", ")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          {[
            { label: "Total Projects",   value: projects.length,          icon: FolderKanban, color: "#4f8ef7" },
            { label: "Healthy (75+)",    value: healthyProjects.length,   icon: TrendingUp,   color: "#34d399" },
            { label: "Need Attention",   value: stalledProjects.length,   icon: AlertTriangle,color: "#f87171" },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} style={{
                padding: "16px", borderRadius: "10px",
                background: "var(--bg-elevated)", border: "1px solid var(--border)",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <Icon size={14} color={stat.color} />
                  <span style={{ fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    {stat.label}
                  </span>
                </div>
                <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "28px", color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Recent activity */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Activity size={13} color="var(--text-muted)" />
            <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Recent Activity
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recentProjects.map(project => (
              <div key={project.id} style={{
                padding: "14px 16px", borderRadius: "10px",
                background: "var(--bg-elevated)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", gap: "14px",
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-hover)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                {/* Health dot */}
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                  background: project.healthScore >= 75 ? "#34d399"
                    : project.healthScore >= 50 ? "#fbbf24" : "#f87171",
                  boxShadow: `0 0 6px ${project.healthScore >= 75 ? "#34d399"
                    : project.healthScore >= 50 ? "#fbbf24" : "#f87171"}60`,
                }} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <p style={{
                      fontSize: "13px", fontFamily: "'Instrument Serif', serif",
                      color: "var(--text-primary)",
                    }}>
                      {project.title}
                    </p>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                      {project.category}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <StatusBadge status={project.status} />
                    <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                      {project.stack.slice(0, 2).join(", ")}
                      {project.stack.length > 2 ? ` +${project.stack.length - 2}` : ""}
                    </span>
                  </div>
                </div>

                {/* Time + health */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)" }}>
                    <Clock size={10} />
                    <span style={{ fontSize: "10px" }}>{timeAgo(project.updatedAt)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{
                      width: "40px", height: "3px", borderRadius: "2px",
                      background: "rgba(255,255,255,0.08)", overflow: "hidden",
                    }}>
                      <div style={{
                        width: `${project.healthScore}%`, height: "100%",
                        background: project.healthScore >= 75 ? "#34d399"
                          : project.healthScore >= 50 ? "#fbbf24" : "#f87171",
                      }} />
                    </div>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                      {project.healthScore}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}