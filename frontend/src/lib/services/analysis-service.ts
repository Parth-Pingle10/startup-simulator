import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteAnalysis, getAnalysisDetail, getAnalysisHistory, getAnalysisProgress, type AnalysisItem } from "@/lib/api/analysis";
import { useAuthSession } from "@/lib/hooks/use-auth";
import type { AnalysisStatus } from "@/lib/types";
import type { Analysis, Recommendation, ValidationAnalytics } from "@/lib/mock";

/** In-memory cache so completed reports don't refetch on every visit. */
const analysisDetailCache = new Map<string, Analysis>();

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
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") {
        const rec = item as Record<string, unknown>;
        return String(rec.title ?? rec.name ?? rec.detail ?? rec.text ?? "").trim();
      }
      return "";
    })
    .filter(Boolean);
}

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function parseAge(ageRange: unknown, fallback = 30) {
  if (typeof ageRange === "number" && Number.isFinite(ageRange)) return Math.round(ageRange);
  const text = String(ageRange ?? "");
  const nums = text.match(/\d+/g)?.map(Number) ?? [];
  if (!nums.length) return fallback;
  if (nums.length === 1) return nums[0];
  return Math.round((nums[0] + nums[1]) / 2);
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildGrowthSeries(avgScore: number, paymentProb: number) {
  const months = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"];
  const baseUsers = Math.max(40, avgScore * 2);
  const baseRevenue = Math.max(20, paymentProb * 3);
  return months.map((month, i) => ({
    month,
    users: Math.round(baseUsers * Math.pow(1 + avgScore / 400, i)),
    revenue: Math.round(baseRevenue * Math.pow(1 + paymentProb / 350, i) * 100),
  }));
}

function buildAdoptionSeries(adoptionProb: number) {
  return Array.from({ length: 10 }, (_, i) => ({
    week: `W${i * 4 + 1}`,
    adoption: clampScore(adoptionProb / (1 + Math.exp(-(i - 4.5) * 0.7))),
  }));
}

function mapRecommendations(report: Record<string, unknown>): Recommendation[] {
  const source =
    asRecord(report.final_report) ??
    asRecord(report.startup_recommendations) ??
    null;
  if (!source) return [];

  const categories: Array<{
    key: string;
    title: string;
    priority: Recommendation["priority"];
    risk: Recommendation["risk"];
  }> = [
    { key: "strategic_recommendations", title: "Strategic recommendations", priority: "Critical", risk: "High" },
    { key: "product_improvements", title: "Product improvements", priority: "High", risk: "Medium" },
    { key: "mvp_features", title: "MVP features", priority: "High", risk: "Low" },
    { key: "future_features", title: "Future features", priority: "Medium", risk: "Low" },
    { key: "pricing_strategy", title: "Pricing strategy", priority: "High", risk: "Medium" },
    { key: "go_to_market_strategy", title: "Go-to-market strategy", priority: "High", risk: "Medium" },
    { key: "marketing_strategy", title: "Marketing strategy", priority: "Medium", risk: "Medium" },
    { key: "launch_strategy", title: "Launch strategy", priority: "High", risk: "High" },
    { key: "next_steps", title: "Next steps", priority: "Critical", risk: "Low" },
  ];

  const cards: Recommendation[] = [];

  for (const category of categories) {
    const actions = asStringList(source[category.key]);
    if (!actions.length) continue;
    cards.push({
      title: category.title,
      detail: actions[0],
      priority: category.priority,
      risk: category.risk,
      actions: actions.slice(1).length ? actions.slice(1) : actions,
    });
  }

  const readiness = String(source.investment_readiness ?? "").trim();
  if (readiness) {
    cards.unshift({
      title: "Investment readiness",
      detail: readiness,
      priority: "Critical",
      risk: "High",
      actions: ["Use this readiness assessment when talking to investors or advisors."],
    });
  }

  return cards;
}

function mapValidation(report: Record<string, unknown>): ValidationAnalytics | null {
  const source =
    asRecord(report.adoption_analytics) ??
    asRecord(report.startup_validation_report) ??
    null;
  if (!source) return null;

  return {
    executiveSummary: String(source.executive_summary ?? ""),
    startupOverview: String(source.startup_overview ?? ""),
    marketValidation: String(source.market_validation ?? ""),
    customerValidation: String(source.customer_validation ?? ""),
    strengths: asStringList(source.startup_strengths),
    weaknesses: asStringList(source.startup_weaknesses),
    opportunities: asStringList(source.market_opportunities),
    threats: asStringList(source.market_threats),
    adoptionProbability: clampScore(toNumber(source.adoption_probability, 0)),
    paymentProbability: clampScore(toNumber(source.payment_probability, 0)),
    recommendationProbability: clampScore(toNumber(source.recommendation_probability, 0)),
    averageAdoptionScore: clampScore(toNumber(source.average_adoption_score, 0)),
    mostLikedFeatures: asStringList(source.most_liked_features),
    mostRequestedFeatures: asStringList(source.most_requested_features),
    topConcerns: asStringList(source.top_customer_concerns),
    barriers: asStringList(source.biggest_adoption_barriers),
    preferredCompetitors: asStringList(source.preferred_competitors),
    earlyAdopters: asStringList(source.likely_early_adopters),
    undecided: asStringList(source.undecided_personas),
    rejectors: asStringList(source.likely_rejectors),
    finalVerdict: String(source.final_verdict ?? ""),
  };
}

export function buildAnalysisView(raw: Record<string, unknown>, fallbackId: string): Analysis {
  const report = asRecord(raw.report) ?? raw;
  const input = {
    name: String(raw.startup_name ?? report.startup_name ?? fallbackId),
    problem: String(raw.problem ?? report.problem ?? ""),
    solution: String(raw.solution ?? report.solution ?? ""),
    targetUsers: String(raw.target_users ?? report.target_users ?? ""),
  };

  const validation = mapValidation(report);
  const features = asStringList(report.key_features);
  const summary = {
    oneLiner: String(
      report.one_line_description ??
        validation?.executiveSummary ??
        `${input.name} is being evaluated.`,
    ),
    industry: String(
      validation?.finalVerdict ||
        asRecord(report.startup_score)?.verdict ||
        "Live backend analysis",
    ),
    features,
  };

  const insights = Array.isArray(report.competitor_insights)
    ? (report.competitor_insights as unknown[])
    : [];
  const research = Array.isArray(report.competitor_research)
    ? (report.competitor_research as unknown[])
    : [];

  const competitors = insights.length
    ? insights.map((item, index) => {
        const candidate = asRecord(item) ?? {};
        const name = String(candidate.competitor ?? candidate.name ?? `Competitor ${index + 1}`);
        const painPoints = asStringList(candidate.pain_points);
        const featureRequests = asStringList(candidate.feature_requests);
        const researchMatch = research.find((entry) => {
          const rec = asRecord(entry);
          return rec && String(rec.competitor ?? "").toLowerCase() === name.toLowerCase();
        });
        const researchRec = asRecord(researchMatch);
        return {
          name,
          initials: initialsFrom(name),
          description:
            painPoints.slice(0, 2).join(" · ") ||
            featureRequests.slice(0, 2).join(" · ") ||
            String(researchRec?.summary ?? researchRec?.error ?? "Competitor intelligence from the analysis."),
          website: String(researchRec?.website ?? researchRec?.url ?? ""),
          strengths: asStringList(candidate.strengths),
          weaknesses: asStringList(candidate.weaknesses),
        };
      })
    : Array.isArray(report.competitors)
      ? (report.competitors as unknown[]).map((competitor, index) => {
          const name =
            typeof competitor === "string"
              ? competitor
              : String(asRecord(competitor)?.name ?? `Competitor ${index + 1}`);
          return {
            name,
            initials: initialsFrom(name),
            description: "Discovered during competitor research.",
            website: "",
            strengths: [] as string[],
            weaknesses: [] as string[],
          };
        })
      : [];

  const marketGaps = asRecord(report.market_gaps);
  const opportunityList = asStringList(marketGaps?.opportunities ?? report.opportunities);
  const uncovered = asStringList(marketGaps?.uncovered_pain_points);
  const fitScore = toNumber(marketGaps?.market_fit_score, 50);
  const gaps = opportunityList.map((title, index) => ({
    title,
    detail: uncovered[index] ?? title,
    opportunity: (fitScore >= 60 ? "High" : "Medium") as "High" | "Medium",
  }));

  const scoreObj = asRecord(report.startup_score);
  const scoreBreakdown = scoreObj
    ? [
        {
          label: "Market fit",
          value: clampScore(toNumber(scoreObj.market_fit_score, 0)),
          reason: String(scoreObj.market_fit_reason ?? ""),
        },
        {
          label: "Differentiation",
          value: clampScore(toNumber(scoreObj.differentiation_score, 0)),
          reason: String(scoreObj.differentiation_reason ?? ""),
        },
        {
          label: "Problem strength",
          value: clampScore(toNumber(scoreObj.problem_strength_score, 0)),
          reason: String(scoreObj.problem_strength_reason ?? ""),
        },
        {
          label: "Monetization",
          value: clampScore(toNumber(scoreObj.monetization_score, 0)),
          reason: String(scoreObj.monetization_reason ?? ""),
        },
        {
          label: "Execution complexity",
          value: clampScore(toNumber(scoreObj.execution_complexity_score, 0)),
          reason: String(scoreObj.execution_complexity_reason ?? ""),
        },
      ]
    : [];

  const score = scoreObj
    ? clampScore(toNumber(scoreObj.overall_score, 0))
    : scoreBreakdown.length
      ? clampScore(scoreBreakdown.reduce((sum, item) => sum + item.value, 0) / scoreBreakdown.length)
      : 0;

  const strengthMeter = validation?.strengths.length
    ? clampScore((validation.strengths.length / Math.max(1, validation.strengths.length + validation.weaknesses.length)) * 100)
    : score;
  const weaknessMeter = validation?.weaknesses.length
    ? clampScore((validation.weaknesses.length / Math.max(1, validation.strengths.length + validation.weaknesses.length)) * 100)
    : clampScore(100 - score);

  const personas = Array.isArray(report.personas)
    ? (report.personas as unknown[]).map((persona) => {
        const candidate = asRecord(persona) ?? {};
        const name = String(candidate.name ?? "Persona");
        return {
          name,
          age: parseAge(candidate.age_range ?? candidate.age, 30),
          occupation: String(candidate.occupation ?? "Target customer"),
          avatar: initialsFrom(name),
          goals: asStringList(candidate.goals),
          frustrations: asStringList(candidate.frustrations),
          buying: [
            candidate.budget_level ? `Budget: ${candidate.budget_level}` : null,
            candidate.tech_savviness ? `Tech: ${candidate.tech_savviness}` : null,
            candidate.adoption_likelihood ? `Adoption: ${candidate.adoption_likelihood}` : null,
          ]
            .filter(Boolean)
            .join(" · ") || "Imported from the backend analysis.",
        };
      })
    : [];

  const feedback = Array.isArray(report.persona_feedback)
    ? (report.persona_feedback as unknown[]).map((item) => {
        const candidate = asRecord(item) ?? {};
        const persona = String(candidate.persona_name ?? candidate.persona ?? candidate.name ?? "Persona");
        const quote = String(
          candidate.customer_review ??
            candidate.adoption_reason ??
            candidate.quote ??
            candidate.feedback ??
            "No feedback captured.",
        );
        return {
          persona,
          avatar: initialsFrom(persona),
          quote,
          sentiment: clampScore(toNumber(candidate.adoption_score ?? candidate.sentiment, 70)),
        };
      })
    : [];

  const market = validation
    ? [
        {
          label: "Adoption",
          value: validation.adoptionProbability,
          note: validation.marketValidation || "Likelihood personas would adopt",
        },
        {
          label: "Payment",
          value: validation.paymentProbability,
          note: validation.customerValidation || "Likelihood personas would pay",
        },
        {
          label: "Recommend",
          value: validation.recommendationProbability,
          note: validation.finalVerdict || "Likelihood personas would recommend",
        },
      ]
    : [];

  const growth = validation
    ? buildGrowthSeries(validation.averageAdoptionScore || score, validation.paymentProbability)
    : [];
  const adoption = validation
    ? buildAdoptionSeries(validation.adoptionProbability || score)
    : [];

  return {
    id: fallbackId,
    input,
    createdAt: Date.parse(String(raw.created_at ?? raw.createdAt ?? new Date().toISOString())),
    status:
      String(raw.status ?? "completed") === "completed" || String(raw.status ?? "completed") === "failed"
        ? "complete"
        : "running",
    score,
    summary,
    competitors,
    gaps,
    scoreBreakdown,
    strengthMeter,
    weaknessMeter,
    personas,
    feedback,
    growth,
    adoption,
    market,
    recommendations: mapRecommendations(report),
    validation,
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
  const cached = analysisDetailCache.get(analysisId) ?? null;
  const [analysis, setAnalysis] = useState<Analysis | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(Boolean(cached));

  useEffect(() => {
    let active = true;
    const existing = analysisDetailCache.get(analysisId);
    if (existing?.status === "complete") {
      setAnalysis(existing);
      setLoading(false);
      setHydrated(true);
      setError(null);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        const data = await getAnalysisDetail(analysisId);
        if (!active) return;
        const view = buildAnalysisView(data as Record<string, unknown>, analysisId);
        if (view.status === "complete") {
          analysisDetailCache.set(analysisId, view);
        }
        setAnalysis(view);
        setError(null);
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
    last_completed_step?: number;
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
            last_completed_step: data.last_completed_step ?? 0,
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
    analysisDetailCache.delete(analysisId);
    toast.success("Analysis deleted");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to delete analysis";
    toast.error(message);
    throw err;
  }
}
