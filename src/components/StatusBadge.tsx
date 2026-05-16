import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/store";

const statusConfig: Record<ProjectStatus, { color: string; bg: string; dot: string }> = {
  Idea:        { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", dot: "#94a3b8" },
  Researching: { color: "#22d3ee", bg: "rgba(34,211,238,0.1)",  dot: "#22d3ee" },
  Planning:    { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)",  dot: "#8b5cf6" },
  Building:    { color: "#4f8ef7", bg: "rgba(79,142,247,0.1)",  dot: "#4f8ef7" },
  Testing:     { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  dot: "#fbbf24" },
  Deploying:   { color: "#fb923c", bg: "rgba(251,146,60,0.1)",  dot: "#fb923c" },
  Live:        { color: "#34d399", bg: "rgba(52,211,153,0.1)",  dot: "#34d399" },
  Maintaining: { color: "#34d399", bg: "rgba(52,211,153,0.07)", dot: "#34d399" },
  Stalled:     { color: "#f87171", bg: "rgba(248,113,113,0.1)", dot: "#f87171" },
  Archived:    { color: "#64748b", bg: "rgba(100,116,139,0.1)", dot: "#64748b" },
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: cfg.dot, boxShadow: `0 0 4px ${cfg.dot}` }}
      />
      {status}
    </span>
  );
}