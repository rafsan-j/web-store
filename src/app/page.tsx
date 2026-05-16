"use client";

import { useEffect, useState } from "react";
import { useNexusStore, Project } from "@/lib/store";
import { useProjects } from "@/hooks/useProjects";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import ProjectsView from "@/components/ProjectsView";
import CommandPalette from "@/components/CommandPalette";
import ProjectDetail from "@/components/ProjectDetail";
import AIInsights from "@/components/AIInsights";
import { PanelLeftClose, PanelLeftOpen, Command, Loader2 } from "lucide-react";
import TimelineView from "@/components/TimelineView";
import ActivityFeed from "@/components/ActivityFeed";

export default function Home() {
  const { sidebarOpen, setSidebarOpen, setCommandPaletteOpen, setProjects } = useNexusStore();
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const db = useProjects();

  useEffect(() => {
    if (!db.loading) setProjects(db.projects);
  }, [db.projects, db.loading]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandPaletteOpen]);

  useEffect(() => {
    if (selectedProject) {
      const updated = db.projects.find(p => p.id === selectedProject.id);
      if (updated) setSelectedProject(updated);
      else setSelectedProject(null);
    }
  }, [db.projects]);

  const renderView = () => {
    if (db.loading) return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100%", gap: "10px", color: "var(--text-muted)", fontSize: "13px",
      }}>
        <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
        Loading workspace...
      </div>
    );

    if (db.error) return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100%", flexDirection: "column", gap: "8px",
      }}>
        <p style={{ color: "#f87171", fontSize: "13px" }}>{db.error}</p>
        <button onClick={db.reload} style={{
          fontSize: "12px", color: "var(--accent-blue)",
          background: "none", border: "none", cursor: "pointer",
        }}>Retry</button>
      </div>
    );

    switch (activeView) {
      case "dashboard":
        return <Dashboard onSelectProject={setSelectedProject} />;
      case "projects":
        return (
          <ProjectsView
            onSelectProject={setSelectedProject}
            onAddProject={db.addProject}
          />
        );
      case "ai":
        return <AIInsights />;
        case "timeline":
  return <TimelineView />;
case "activity":
  return <ActivityFeed />;
      default:
        return (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: "100%", flexDirection: "column", gap: "12px",
          }}>
            <p style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "28px", color: "var(--text-primary)",
            }}>
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100vw",
      overflow: "hidden", background: "var(--bg-base)",
    }}>
      <Sidebar
        activeView={activeView}
        onViewChange={v => { setActiveView(v); setSelectedProject(null); }}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px", height: "44px", flexShrink: 0,
          background: "var(--bg-surface)", borderBottom: "1px solid var(--border)",
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", padding: "6px", borderRadius: "6px", display: "flex",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            {sidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
          </button>

          <button
            onClick={() => setCommandPaletteOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "5px 12px", borderRadius: "7px",
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              color: "var(--text-muted)", cursor: "pointer",
              fontSize: "11px", fontFamily: "var(--font-mono)",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--border-hover)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <Command size={11} />
            <span>Command Palette</span>
            <kbd style={{
              fontSize: "10px", padding: "1px 5px", borderRadius: "4px",
              background: "var(--glass)", border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}>⌘K</kbd>
          </button>
        </header>

        {/* Content + Detail Panel */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <main style={{ flex: 1, overflow: "hidden" }}>
            {renderView()}
          </main>
          {selectedProject && (
            <ProjectDetail
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
              onDelete={async (id) => { await db.removeProject(id); setSelectedProject(null); }}
              onUpdate={db.updateProject}
            />
          )}
        </div>
      </div>

      <CommandPalette onNavigate={v => { setActiveView(v); setSelectedProject(null); }} />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}