"use client";

import { useNexusStore } from "@/lib/store";
import StatusBadge from "./StatusBadge";
import {
  GitBranch, Rocket, Plus, Edit3,
  Calendar, Clock, Filter,
} from "lucide-react";

type TimelineEvent = {
  id: string;
  projectId: string;
  projectTitle: string;
  type: "created" | "updated" | "deployed" | "status_change";
  description: string;
  date: string;
};

function buildTimeline(projects: ReturnType<typeof useNexusStore.getState>["projects"]): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  projects.forEach(p => {
    events.push({
      id: `${p.id}-created`,
      projectId: p.id,
      projectTitle: p.title,
      type: "created",
      description: `Project created with status "${p.status}"`,
      date: p.createdAt,
    });

    if (p.updatedAt !== p.createdAt) {
      events.push({
        id: `${p.id}-updated`,
        projectId: p.id,
        projectTitle: p.title,
        type: "updated",
        description: `Project details updated`,
        date: p.updatedAt,
      });
    }

    if (p.liveUrl) {
      events.push({
        id: `${p.id}-deployed`,
        projectId: p.id,
        projectTitle: p.title,
        type: "deployed",
        description: `Project went live`,
        date: p.updatedAt,
      });
    }
  });

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const eventConfig = {
  created:       { icon: Plus,     color: "#4f8ef7", bg: "rgba(79,142,247,0.15)",  label: "Created"  },
  updated:       { icon: Edit3,    color: "#8b5cf6", bg: "rgba(139,92,246,0.15)", label: "Updated"  },
  deployed:      { icon: Rocket,   color: "#34d399", bg: "rgba(52,211,153,0.15)", label: "Deployed" },
  status_change: { icon: GitBranch,color: "#fbbf24", bg: "rgba(251,191,36,0.15)", label: "Status"   },
};

function groupByDate(events: TimelineEvent[]) {
  const groups: Record<string, TimelineEvent[]> = {};
  events.forEach(e => {
    const date = new Date(e.date).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(e);
  });
  return groups;
}

export default function TimelineView() {
  const { projects } = useNexusStore();
  const events = buildTimeline(projects);
  const grouped = groupByDate(events);

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "36px" }}>
          <div>
            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "32px", fontWeight: 400, color: "var(--text-primary)",
            }}>
              Timeline
            </h1>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
              {events.length} events across {projects.length} projects
            </p>
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "7px 14px", borderRadius: "8px",
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            color: "var(--text-secondary)", cursor: "pointer",
            fontSize: "11px", fontFamily: "var(--font-mono)",
          }}>
            <Filter size={12} /> Filter
          </button>
        </div>

        {/* Stats row */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px", marginBottom: "36px",
        }}>
          {[
            { label: "Total Events", value: events.length, color: "#4f8ef7" },
            { label: "Created",  value: events.filter(e => e.type === "created").length,  color: "#8b5cf6" },
            { label: "Updated",  value: events.filter(e => e.type === "updated").length,  color: "#fbbf24" },
            { label: "Deployed", value: events.filter(e => e.type === "deployed").length, color: "#34d399" },
          ].map(stat => (
            <div key={stat.label} style={{
              padding: "14px 16px", borderRadius: "10px",
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
            }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
                {stat.label}
              </p>
              <p style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "24px", color: stat.color,
              }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        {events.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 0",
            color: "var(--text-muted)", fontSize: "13px",
          }}>
            <Calendar size={32} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
            No timeline events yet. Start adding projects.
          </div>
        ) : (
          <div>
            {Object.entries(grouped).map(([date, dayEvents]) => (
              <div key={date} style={{ marginBottom: "32px" }}>
                {/* Date header */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  marginBottom: "16px",
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    fontSize: "11px", color: "var(--text-muted)",
                    letterSpacing: "0.06em",
                  }}>
                    <Calendar size={11} />
                    {date}
                  </div>
                  <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
                  <span style={{
                    fontSize: "10px", color: "var(--text-muted)",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    padding: "2px 8px", borderRadius: "10px",
                  }}>
                    {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Events */}
                <div style={{ position: "relative", paddingLeft: "24px" }}>
                  {/* Vertical line */}
                  <div style={{
                    position: "absolute", left: "7px", top: 0, bottom: 0,
                    width: "1px", background: "var(--border)",
                  }} />

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {dayEvents.map(event => {
                      const cfg = eventConfig[event.type];
                      const Icon = cfg.icon;
                      return (
                        <div key={event.id} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                          {/* Dot */}
                          <div style={{
                            position: "absolute", left: 0,
                            width: "15px", height: "15px", borderRadius: "50%",
                            background: cfg.bg,
                            border: `1px solid ${cfg.color}40`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, marginTop: "10px",
                          }}>
                            <Icon size={8} color={cfg.color} />
                          </div>

                          {/* Card */}
                          <div style={{
                            flex: 1,
                            padding: "12px 16px", borderRadius: "10px",
                            background: "var(--bg-elevated)",
                            border: "1px solid var(--border)",
                            transition: "border-color 0.15s",
                          }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-hover)")}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
                          >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{
                                  fontSize: "10px", padding: "1px 7px", borderRadius: "4px",
                                  background: cfg.bg, color: cfg.color,
                                  border: `1px solid ${cfg.color}30`,
                                }}>
                                  {cfg.label}
                                </span>
                                <span style={{
                                  fontSize: "12px", fontWeight: 500,
                                  color: "var(--text-primary)",
                                  fontFamily: "'Instrument Serif', serif",
                                }}>
                                  {event.projectTitle}
                                </span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)" }}>
                                <Clock size={10} />
                                <span style={{ fontSize: "10px" }}>
                                  {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                            </div>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                              {event.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}