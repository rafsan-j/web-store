"use client";

import { useState } from "react";
import { Project, ProjectStatus, ProjectCategory } from "@/lib/store";
import { X, Save } from "lucide-react";

const STATUSES: ProjectStatus[] = [
  "Idea", "Researching", "Planning", "Building",
  "Testing", "Deploying", "Live", "Maintaining", "Stalled", "Archived",
];

const CATEGORIES: ProjectCategory[] = [
  "SaaS", "AI Tool", "PWA", "Experiment",
  "Research", "Portfolio", "Automation", "Other",
];

interface Props {
  project: Project;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Project>) => Promise<unknown>;
}

export default function EditProjectModal({ project, onClose, onSave }: Props) {
  const [stackInput, setStackInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: project.title,
    description: project.description,
    category: project.category,
    status: project.status,
    priority: project.priority,
    visibility: project.visibility,
    stack: project.stack ?? [],
    repoUrl: project.repoUrl ?? "",
    liveUrl: project.liveUrl ?? "",
    healthScore: project.healthScore,
  });

  const set = (key: string, value: unknown) =>
    setForm(f => ({ ...f, [key]: value }));

  const addStack = () => {
    const tag = stackInput.trim();
    if (tag && !form.stack.includes(tag)) set("stack", [...form.stack, tag]);
    setStackInput("");
  };

  const removeStack = (tech: string) =>
    set("stack", form.stack.filter((t: string) => t !== tech));

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSave(project.id, {
        ...form,
        slug: form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "540px", maxHeight: "85vh",
          borderRadius: "16px", overflow: "hidden",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-hover)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid var(--border)", flexShrink: 0,
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "20px", fontWeight: 400, color: "var(--text-primary)",
            }}>
              Edit Project
            </h2>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
              {project.slug}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-muted)", padding: "4px", display: "flex",
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div style={{
          overflowY: "auto", padding: "24px",
          display: "flex", flexDirection: "column", gap: "18px",
        }}>
          <Field label="Project Title *">
            <input
              autoFocus
              value={form.title}
              onChange={e => set("title", e.target.value)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "var(--accent-blue)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
              onFocus={e => (e.target.style.borderColor = "var(--accent-blue)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Category">
              <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => set("status", e.target.value)} style={inputStyle}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Field label="Priority">
              <select value={form.priority} onChange={e => set("priority", e.target.value)} style={inputStyle}>
                {["Low", "Medium", "High", "Critical"].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Visibility">
              <select value={form.visibility} onChange={e => set("visibility", e.target.value)} style={inputStyle}>
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </Field>
          </div>

          <Field label="Health Score ({form.healthScore})">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input
                type="range" min={0} max={100}
                value={form.healthScore}
                onChange={e => set("healthScore", Number(e.target.value))}
                style={{ flex: 1, accentColor: "var(--accent-blue)" }}
              />
              <span style={{
                fontSize: "14px", fontFamily: "'Instrument Serif', serif",
                color: form.healthScore >= 75 ? "#34d399" : form.healthScore >= 50 ? "#fbbf24" : "#f87171",
                minWidth: "32px", textAlign: "right",
              }}>
                {form.healthScore}
              </span>
            </div>
          </Field>

          <Field label="Tech Stack">
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                value={stackInput}
                onChange={e => setStackInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addStack(); } }}
                placeholder="e.g. Next.js — press Enter"
                style={{ ...inputStyle, flex: 1 }}
                onFocus={e => (e.target.style.borderColor = "var(--accent-blue)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")}
              />
              <button onClick={addStack} style={{
                padding: "0 14px", borderRadius: "8px",
                background: "var(--accent-blue)", border: "none",
                color: "white", cursor: "pointer",
                fontSize: "12px", fontFamily: "var(--font-mono)",
              }}>Add</button>
            </div>
            {form.stack.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                {form.stack.map((tech: string) => (
                  <span key={tech} style={{
                    display: "flex", alignItems: "center", gap: "5px",
                    fontSize: "11px", padding: "3px 8px", borderRadius: "5px",
                    background: "rgba(79,142,247,0.12)",
                    border: "1px solid rgba(79,142,247,0.25)",
                    color: "var(--accent-blue)",
                  }}>
                    {tech}
                    <button
                      onClick={() => removeStack(tech)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", display: "flex", padding: 0 }}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <Field label="Repository URL">
            <input
              value={form.repoUrl}
              onChange={e => set("repoUrl", e.target.value)}
              placeholder="https://github.com/you/project"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "var(--accent-blue)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </Field>

          <Field label="Live URL">
            <input
              value={form.liveUrl}
              onChange={e => set("liveUrl", e.target.value)}
              placeholder="https://yourproject.com"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "var(--accent-blue)")}
              onBlur={e => (e.target.style.borderColor = "var(--border)")}
            />
          </Field>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", justifyContent: "flex-end", gap: "10px",
          padding: "16px 24px",
          borderTop: "1px solid var(--border)", flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            padding: "8px 18px", borderRadius: "8px",
            background: "transparent", border: "1px solid var(--border)",
            color: "var(--text-secondary)", cursor: "pointer",
            fontSize: "12px", fontFamily: "var(--font-mono)",
          }}>Cancel</button>
          <button
            onClick={() => void handleSave()}
            disabled={!form.title.trim() || saving}
            style={{
              padding: "8px 20px", borderRadius: "8px",
              background: form.title.trim() && !saving ? "var(--accent-blue)" : "rgba(79,142,247,0.3)",
              border: "none", color: "white",
              cursor: form.title.trim() && !saving ? "pointer" : "not-allowed",
              fontSize: "12px", fontFamily: "var(--font-mono)",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            <Save size={13} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{
        fontSize: "10px", letterSpacing: "0.08em",
        textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 500,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", borderRadius: "8px",
  background: "var(--bg-surface)", border: "1px solid var(--border)",
  color: "var(--text-primary)", fontSize: "12px",
  fontFamily: "var(--font-mono)", outline: "none", transition: "border-color 0.15s",
};