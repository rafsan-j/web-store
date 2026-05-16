"use client";

import { useNexusStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FolderKanban, GitBranch, Sparkles,
  Rocket, BookOpen, Activity, Globe, BarChart3, Users,
  Settings, Zap, ChevronRight, Terminal,
} from "lucide-react";

const navSections = [
  {
    label: "Workspace",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
      { icon: FolderKanban,    label: "Projects",  id: "projects" },
      { icon: GitBranch,       label: "Timeline",  id: "timeline" },
      { icon: Sparkles,        label: "AI Insights", id: "ai" },
      { icon: Rocket,          label: "Deployments", id: "deployments" },
      { icon: BookOpen,        label: "Knowledge Vault", id: "knowledge" },
      { icon: Activity,        label: "Activity Feed",   id: "activity" },
    ],
  },
  {
    label: "Public",
    items: [
      { icon: Globe,     label: "Portfolio",  id: "portfolio" },
      { icon: BarChart3, label: "Analytics",  id: "analytics" },
      { icon: Users,     label: "Visitors",   id: "visitors" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Settings, label: "Settings",     id: "settings" },
      { icon: Zap,      label: "Integrations", id: "integrations" },
    ],
  },
];

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const { sidebarOpen } = useNexusStore();

  return (
    <aside
      style={{
        width: sidebarOpen ? "220px" : "52px",
        minWidth: sidebarOpen ? "220px" : "52px",
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "width 0.25s ease, min-width 0.25s ease",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: sidebarOpen ? "18px 16px" : "18px 14px",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
          background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Terminal size={13} color="white" />
        </div>
        {sidebarOpen && (
          <span style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "17px",
            color: "var(--text-primary)",
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
          }}>
            Nexus
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
        {navSections.map((section, si) => (
          <div key={section.label} style={{ marginBottom: si < navSections.length - 1 ? "20px" : 0 }}>
            {sidebarOpen && (
              <p style={{
                fontSize: "9px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                padding: "0 8px",
                marginBottom: "4px",
                fontWeight: 500,
              }}>
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: sidebarOpen ? "7px 8px" : "7px",
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                    borderRadius: "7px",
                    border: "none",
                    cursor: "pointer",
                    background: isActive ? "rgba(79,142,247,0.1)" : "transparent",
                    color: isActive ? "var(--accent-blue)" : "var(--text-secondary)",
                    fontSize: "12px",
                    fontFamily: "var(--font-mono)",
                    transition: "all 0.12s ease",
                    marginBottom: "1px",
                    outline: "none",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "var(--glass-hover)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  <Icon size={14} style={{ flexShrink: 0 }} />
                  {sidebarOpen && (
                    <>
                      <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                      {isActive && <ChevronRight size={11} style={{ opacity: 0.4 }} />}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      {sidebarOpen && (
        <div style={{
          padding: "10px 8px",
          borderTop: "1px solid var(--border)",
          flexShrink: 0,
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px",
            borderRadius: "8px",
            background: "var(--glass)",
            cursor: "pointer",
          }}>
            <div style={{
              width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 700, color: "white",
            }}>D</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "11px", color: "var(--text-primary)", fontWeight: 500 }}>Developer</p>
              <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>Private Workspace</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}