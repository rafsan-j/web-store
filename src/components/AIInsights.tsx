"use client";

import { useEffect, useState } from "react";
import { useNexusStore } from "@/lib/store";
import {
  Sparkles, AlertTriangle, CheckCircle2, Info,
  Lightbulb, TrendingUp, TrendingDown, Minus,
  RefreshCw, Target,
} from "lucide-react";

type InsightType = "warning" | "suggestion" | "success" | "info";

interface Insight {
  type: InsightType;
  title: string;
  body: string;
  project: string | null;
}

interface AIResponse {
  summary: string;
  insights: Insight[];
  healthTrend: "improving" | "stable" | "declining";
  focusRecommendation: string;
}

const insightConfig: Record<InsightType, { icon: typeof AlertTriangle; color: string; bg: string; border: string }> = {
  warning:    { icon: AlertTriangle, color: "#fbbf24", bg: "rgba(251,191,36,0.07)",  border: "rgba(251,191,36,0.2)"  },
  suggestion: { icon: Lightbulb,     color: "#8b5cf6", bg: "rgba(139,92,246,0.07)", border: "rgba(139,92,246,0.2)"  },
  success:    { icon: CheckCircle2,  color: "#34d399", bg: "rgba(52,211,153,0.07)", border: "rgba(52,211,153,0.2)"  },
  info:       { icon: Info,          color: "#4f8ef7", bg: "rgba(79,142,247,0.07)", border: "rgba(79,142,247,0.2)"  },
};

const trendConfig = {
  improving: { icon: TrendingUp,   color: "#34d399", label: "Improving" },
  stable:    { icon: Minus,        color: "#4f8ef7", label: "Stable"    },
  declining: { icon: TrendingDown, color: "#f87171", label: "Declining" },
};

export default function AIInsights() {
  const { projects } = useNexusStore();
  const [data, setData]       = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  useEffect(() => {
    if (projects.length > 0) analyze();
  }, []);

  async function analyze() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects }),
      });
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
      setLastRun(new Date());
    } catch (e) {
      console.error(e);
      setError("Failed to generate insights. Check your Gemini API key in .env.local.");
    } finally {
      setLoading(false);
    }
  }

  const trend = data ? trendConfig[data.healthTrend] : null;
  const TrendIcon = trend?.icon;

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "28px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "32px", fontWeight: 400, color: "var(--text-primary)" }}>
              AI Insights
            </h1>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
              {lastRun
                ? `Last analyzed at ${lastRun.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "Powered by Gemini — click Analyze to start"}
            </p>
          </div>
          <button
            onClick={analyze}
            disabled={loading}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "8px 16px", borderRadius: "8px",
              background: loading ? "rgba(79,142,247,0.3)" : "var(--accent-blue)",
              border: "none", color: "white",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "12px", fontFamily: "var(--font-mono)",
            }}
          >
            <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            {loading ? "Analyzing..." : "Analyze Projects"}
          </button>
        </div>

        {/* Loading */}
        {loading && !data && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "16px" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(79,142,247,0.15), rgba(139,92,246,0.15))",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={22} color="#4f8ef7" style={{ animation: "pulse 1.5s ease infinite" }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "14px", color: "var(--text-primary)", marginBottom: "4px" }}>Analyzing your projects...</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Gemini is reviewing your portfolio</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: "16px 20px", borderRadius: "12px",
            background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",
          }}>
            <p style={{ fontSize: "13px", color: "#f87171" }}>{error}</p>
          </div>
        )}

        {/* Results */}
        {data && (
          <>
            {/* Summary + Trend */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "start" }}>
              <div style={{
                padding: "20px 24px", borderRadius: "14px",
                background: "linear-gradient(135deg, rgba(79,142,247,0.07), rgba(139,92,246,0.07))",
                border: "1px solid rgba(79,142,247,0.18)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <Sparkles size={14} color="#4f8ef7" />
                  <span style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#4f8ef7", fontWeight: 600 }}>
                    Portfolio Summary
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {data.summary}
                </p>
              </div>

              {trend && TrendIcon && (
                <div style={{
                  padding: "20px", borderRadius: "14px",
                  background: "var(--bg-elevated)", border: "1px solid var(--border)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                  minWidth: "110px",
                }}>
                  <TrendIcon size={24} color={trend.color} />
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "12px", color: trend.color, fontWeight: 600 }}>{trend.label}</p>
                    <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>Health Trend</p>
                  </div>
                </div>
              )}
            </div>

            {/* Focus recommendation */}
            <div style={{
              padding: "16px 20px", borderRadius: "12px",
              background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.18)",
              display: "flex", alignItems: "flex-start", gap: "12px",
            }}>
              <Target size={15} color="#34d399" style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: "10px", fontWeight: 600, color: "#34d399", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                  This Week&apos;s Focus
                </p>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  {data.focusRecommendation}
                </p>
              </div>
            </div>

            {/* Insights */}
            <div>
              <p style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "14px", fontWeight: 500 }}>
                Insights · {data.insights.length}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {data.insights.map((insight, i) => {
                  const cfg = insightConfig[insight.type] ?? insightConfig.info;
                  const Icon = cfg.icon;
                  return (
                    <div key={i} style={{
                      padding: "16px 18px", borderRadius: "12px",
                      background: cfg.bg, border: `1px solid ${cfg.border}`,
                      display: "flex", alignItems: "flex-start", gap: "12px",
                    }}>
                      <Icon size={15} color={cfg.color} style={{ marginTop: "2px", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                          <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>
                            {insight.title}
                          </p>
                          {insight.project && (
                            <span style={{
                              fontSize: "10px", padding: "1px 7px", borderRadius: "4px",
                              background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)",
                              color: "var(--text-muted)",
                            }}>
                              {insight.project}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                          {insight.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && !data && !error && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "80px 0", gap: "14px",
          }}>
            <Sparkles size={36} color="var(--text-muted)" />
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
              Click &quot;Analyze Projects&quot; to get AI insights
            </p>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}