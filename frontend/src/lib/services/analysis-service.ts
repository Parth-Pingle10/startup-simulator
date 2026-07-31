import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteAnalysis, getAnalysisDetail, getAnalysisHistory, getAnalysisProgress, type AnalysisItem } from "@/lib/api/analysis";
import { useAuthSession } from "@/lib/hooks/use-auth";
import type { AnalysisStatus } from "@/lib/types";
import type { Analysis } from "@/lib/mock";

function normalizeAnalysis(item: AnalysisItem) {
  return {
    analysis_id: item.analysis_id,
    startup_name: item.startup_name,
    status: item.status as AnalysisStatus,
    created_at: item.created_at,
    completed_at: item.completed_at,
    total_runtime: item.total_runtime,
  };
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function buildAnalysisView(raw: Record<string, unknown>, fallbackId: string): Analysis {
  const report = (raw.report as Record<string, unknown> | undefined) ?? (raw as Record<string, unknown>);
  const input = {
    name: String(raw.startup_name ?? report.startup_name ?? fallbackId),
    problem: String(raw.problem ?? report.problem ?? ""),
    solution: String(raw.solution ?? report.solution ?? ""),
    targetUsers: String(raw.target_users ?? report.target_users ?? ""),
  };

  const summary = {
    oneLiner: String(report.executive_summary ?? report.one_line_description ?? `${input.name} is being evaluated.`),
    industry: String(report.industry ?? "Live backend analysis"),
    features: Array.isArray(report.key_recommendations)
      ? (report.key_recommendations as unknown[]).filter((item): item is string => typeof item === "string")
      : Array.isArray(report.strengths)
        ? (report.strengths as unknown[]).filter((item): item is string => typeof item === "string")
        : [],
  };

  const competitors = Array.isArray(report.competitors)
    ? (report.competitors as unknown[]).map((competitor, index) => {
        if (typeof competitor === "string") {
          return {
            name: competitor,
            initials: competitor.slice(0, 2).toUpperCase(),
            description: "Imported from the backend analysis.",
            website: "",
            strengths: [],
            weaknesses: [],
          };
        }
        const candidate = competitor as Record<string, unknown>;
        return {
          name: String(candidate.name ?? `Competitor ${index + 1}`),
          initials: String(candidate.initials ?? candidate.name ?? `C${index + 1}`).slice(0, 2).toUpperCase(),
          description: String(candidate.description ?? candidate.summary ?? "Imported from the backend analysis."),
          website: String(candidate.website ?? ""),
          strengths: Array.isArray(candidate.strengths)
            ? (candidate.strengths as unknown[]).filter((item): item is string => typeof item === "string")
            : [],
          weaknesses: Array.isArray(candidate.weaknesses)
            ? (candidate.weaknesses as unknown[]).filter((item): item is string => typeof item === "string")
            : [],
        };
      })
    : [];

  const gaps = Array.isArray(report.opportunities)
    ? (report.opportunities as unknown[]).map((item, index) => ({
        title: typeof item === "string" ? item : `Opportunity ${index + 1}`,
        detail: typeof item === "string" ? item : "Imported from the backend analysis.",
        opportunity: index % 2 === 0 ? "High" : "Medium" as const,
      }))
    : [];

  const scoreBreakdown = Array.isArray(report.score_breakdown)
    ? (report.score_breakdown as unknown[]).map((item) => {
        const candidate = item as Record<string, unknown>;
        return {
          label: String(candidate.label ?? "Score"),
          value: toNumber(candidate.value, 0),
        };
      })
    : [];

  const score = scoreBreakdown.length
    ? Math.round(scoreBreakdown.reduce((sum, item) => sum + item.value, 0) / scoreBreakdown.length)
    : toNumber(report.score, 0);

  const personas = Array.isArray(report.personas)
    ? (report.personas as unknown[]).map((persona) => {
        const candidate = persona as Record<string, unknown>;
        return {
          name: String(candidate.name ?? "Persona"),
          age: toNumber(candidate.age, 30),
          occupation: String(candidate.occupation ?? "Target customer"),
          avatar: String(candidate.avatar ?? candidate.name ?? "P").slice(0, 2).toUpperCase(),
          goals: Array.isArray(candidate.goals)
            ? (candidate.goals as unknown[]).filter((item): item is string => typeof item === "string")
            : [],
          frustrations: Array.isArray(candidate.frustrations)
            ? (candidate.frustrations as unknown[]).filter((item): item is string => typeof item === "string")
            : [],
          buying: String(candidate.buying ?? "Imported from the backend analysis."),
        };
      })
    : [];

  const feedback = Array.isArray(report.persona_feedback)
    ? (report.persona_feedback as unknown[]).map((item) => {
        const candidate = item as Record<string, unknown>;
        return {
          persona: String(candidate.persona ?? candidate.name ?? "Persona"),
          avatar: String(candidate.avatar ?? candidate.persona ?? "P").slice(0, 2).toUpperCase(),
          quote: String(candidate.quote ?? candidate.feedback ?? "Imported from the backend analysis."),
          sentiment: toNumber(candidate.sentiment, 70),
        };
      })
    : [];

  return {
    id: fallbackId,
    input,
    createdAt: Date.parse(String(raw.created_at ?? raw.createdAt ?? new Date().toISOString())),
    status: String(raw.status ?? "completed") === "completed" || String(raw.status ?? "completed") === "failed" ? "complete" : "running",
    score: Math.max(0, Math.min(100, score)),
    summary,
    competitors,
    gaps,
    scoreBreakdown,
    strengthMeter: toNumber(report.strength_meter, score),
    weaknessMeter: toNumber(report.weakness_meter, Math.max(0, 100 - score)),
    personas,
    feedback,
    growth: [],
    adoption: [],
    market: [],
    recommendations: [],
  };
}

export function useAnalysisList() {
  const [items, setItems] = useState<AnalysisItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuthSession();

  const refresh = useCallback(async () => {
    if (!session) {
      setItems([]);
      setHydrated(true);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      const result = await getAnalysisHistory();
      setItems(result.analysis.map(normalizeAnalysis));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analyses");
    } finally {
      setHydrated(true);
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { items, hydrated, loading, error, refresh };
}

export function useAnalysisDetail(analysisId: string) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const data = await getAnalysisDetail(analysisId);
        if (active) setAnalysis(buildAnalysisView(data as Record<string, unknown>, analysisId));
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load analysis");
      } finally {
        if (active) {
          setLoading(false);
          setHydrated(true);
        }
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [analysisId]);

  return { analysis, loading, error, hydrated };
}

export function useAnalysisProgress(analysisId: string) {
  const [progress, setProgress] = useState<{
    progress: number;
    current_agent: string | null;
    status: string;
    started_at?: string;
    completed_at?: string;
    total_runtime?: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let timeoutId: number | undefined;

    async function load() {
      try {
        setLoading(true);
        const data = await getAnalysisProgress(analysisId);
        if (active) {
          setProgress({
            progress: data.progress ?? 0,
            current_agent: data.current_agent ?? null,
            status: data.status ?? "running",
            started_at: data.started_at,
            completed_at: data.completed_at,
            total_runtime: data.total_runtime,
          });
          setError(null);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load progress");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    const poll = () => {
      timeoutId = window.setTimeout(() => {
        void load();
        poll();
      }, 2500);
    };
    poll();

    return () => {
      active = false;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [analysisId]);

  return { progress, loading, error };
}

export async function removeAnalysis(analysisId: string) {
  try {
    await deleteAnalysis(analysisId);
    toast.success("Analysis deleted");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to delete analysis";
    toast.error(message);
    throw err;
  }
}
