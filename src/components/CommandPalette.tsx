"use client";

import { useState } from "react";
import { useNexusStore } from "@/lib/store";
import { Search, FolderKanban, LayoutDashboard, Rocket, Sparkles, X } from "lucide-react";

const COMMANDS = [
  { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, shortcut: "D" },
  { id: "projects",  label: "Go to Projects",  icon: FolderKanban,    shortcut: "P" },
  { id: "ai",        label: "AI Insights",      icon: Sparkles,        shortcut: "A" },
  { id: "deployments", label: "Deployments",    icon: Rocket,          shortcut: "R" },
];

interface CommandPaletteProps {
  onNavigate: (view: string) => void;
}

export default function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const { commandPaletteOpen, setCommandPaletteOpen, projects } = useNexusStore();
  const [query, setQuery] = useState("");

  const filteredCommands = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  if (!commandPaletteOpen) return null;

  const closePalette = () => {
    setQuery("");
    setCommandPaletteOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-32"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={closePalette}
    >
      <div
        className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          background: "var(--bg-elevated)",
          borderColor: "var(--border-hover)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div
          className="flex items-center gap-3 px-4 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <Search size={16} style={{ color: "var(--text-muted)" }} />
          <input
            autoFocus
            type="text"
            placeholder="Search or type a command..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <button onClick={closePalette}>
            <X size={14} style={{ color: "var(--text-muted)" }} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length > 0 && (
            <div className="mb-2">
              <p className="text-xs px-2 py-1 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Commands
              </p>
              {filteredCommands.map(cmd => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => { onNavigate(cmd.id); closePalette(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--glass-hover)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <Icon size={14} style={{ color: "var(--accent-blue)" }} />
                    {cmd.label}
                    <kbd
                      className="ml-auto text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: "var(--glass)",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {cmd.shortcut}
                    </kbd>
                  </button>
                );
              })}
            </div>
          )}

          {filteredProjects.length > 0 && (
            <div>
              <p className="text-xs px-2 py-1 uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Projects
              </p>
              {filteredProjects.map(project => (
                <button
                  key={project.id}
                  onClick={() => setCommandPaletteOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--glass-hover)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <FolderKanban size={14} style={{ color: "var(--accent-purple)" }} />
                  {project.title}
                  <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
                    {project.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {filteredCommands.length === 0 && filteredProjects.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
              No results for &quot;{query}&quot;
            </p>
          )}
        </div>

        <div
          className="px-4 py-2 border-t flex items-center gap-4 text-xs"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <span>↵ select</span>
          <span>esc close</span>
          <span className="ml-auto">⌘K to toggle</span>
        </div>
      </div>
    </div>
  );
}