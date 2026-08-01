import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Check,
  Compass,
  FileText,
  Gauge,
  Loader2,
  MessageSquare,
  Radar,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ScoreRing } from "@/components/report/ScoreRing";
import { pauseAnalysis, resumeAnalysis } from "@/lib/api/analysis";
import { readAuth } from "@/lib/auth/storage";
import { AGENTS } from "@/lib/mock";
import { useAnalysisProgress } from "@/lib/services/analysis-service";
import { API_BASE_URL } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const ICONS = {
  Sparkles,
  Radar,
  Search,
  Compass,
  Gauge,
  Users,
  MessageSquare,
  TrendingUp,
  FileText,
} as const;

export const Route = createFileRoute("/analysis/$id/progress")({
  head: () => ({
    meta: [
      { title: "Running analysis — AI Startup Simulator" },
      { name: "description", content: "Watch AI agents research and score your startup live." },
      { property: "og:title", content: "Running analysis — AI Startup Simulator" },
      { property: "og:description", content: "Specialised agents, running live." },
    ],
  }),
  component: ProgressPage,
});

function resolveCurrentAgentIndex(
  currentAgent: string | null | undefined,
  progressPct: number,
  lastCompletedStep: number,
  isDone: boolean,
) {
  if (isDone) return AGENTS.length;

  if (currentAgent) {
    const byName = AGENTS.findIndex(
      (a) => a.title.toLowerCase() === currentAgent.trim().toLowerCase(),
    );
    if (byName >= 0) return byName;
  }

  // After N agents completed, we're on agent N+1 (0-based index = lastCompleted)
  if (lastCompletedStep > 0) {
    return Math.min(AGENTS.length - 1, lastCompletedStep);
  }

  if (progressPct > 0) {
    return Math.min(AGENTS.length - 1, Math.floor(progressPct / 10));
  }

  return 0;
}

function sendPauseBeacon(analysisId: string) {
  const auth = readAuth();
  if (!auth?.accessToken) return;
  const url = `${API_BASE_URL}/analysis/${analysisId}/pause`;
  const body = JSON.stringify({});
  try {
    // Prefer keepalive fetch so auth header is preserved
    void fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.accessToken}`,
      },
      body,
      keepalive: true,
    });
  } catch {
    void pauseAnalysis(analysisId).catch(() => undefined);
  }
}

function ProgressPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { progress } = useAnalysisProgress(id);
  const leavingRef = useRef(false);
  const doneRef = useRef(false);

  const done = Boolean(progress?.status === "completed" || progress?.progress === 100);
  doneRef.current = done;

  // Resume when opening a paused / incomplete analysis
  useEffect(() => {
    let active = true;
    async function maybeResume() {
      try {
        const result = await resumeAnalysis(id);
        if (!active) return;
        if (result.status === "completed") {
          navigate({ to: "/analysis/$id", params: { id } });
        }
      } catch {
        // ignore — may already be running
      }
    }
    void maybeResume();
    return () => {
      active = false;
    };
  }, [id, navigate]);

  // Pause when leaving the page / tab / closing
  useEffect(() => {
    const pauseIfNeeded = () => {
      if (doneRef.current || leavingRef.current) return;
      leavingRef.current = true;
      sendPauseBeacon(id);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") pauseIfNeeded();
    };

    window.addEventListener("pagehide", pauseIfNeeded);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("pagehide", pauseIfNeeded);
      document.removeEventListener("visibilitychange", onVisibility);
      pauseIfNeeded();
    };
  }, [id]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => navigate({ to: "/analysis/$id", params: { id } }), 900);
    return () => clearTimeout(t);
  }, [done, id, navigate]);

  const lastCompleted = Number(progress?.last_completed_step ?? 0);
  const currentIdx = useMemo(
    () =>
      resolveCurrentAgentIndex(
        progress?.current_agent,
        progress?.progress ?? 0,
        lastCompleted,
        done,
      ),
    [progress?.current_agent, progress?.progress, lastCompleted, done],
  );

  const states = AGENTS.map((_, i) => {
    if (done || i < currentIdx) return "done";
    if (i === currentIdx) return "running";
    return "queued";
  });

  // Agent 1 running → 0%; agent 4 running → 30%; rises when each agent completes
  const pct = done ? 100 : Math.min(100, currentIdx * 10);
  const runningTitle = done ? null : AGENTS[currentIdx]?.title;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="surface flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
          <ScoreRing value={pct} size={112} label="complete" />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold sm:text-3xl">
              {done
                ? "Report ready"
                : progress?.status === "paused"
                  ? "Analysis paused"
                  : "Your analysis is running"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {done
                ? "Opening your report…"
                : progress?.status === "paused"
                  ? "Re-open this analysis to resume from the last unfinished agent."
                  : runningTitle
                    ? `${runningTitle} is running now`
                    : "Agents are starting up — hang tight."}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {AGENTS.map((agent, i) => {
            const state = states[i];
            const Icon = ICONS[agent.icon as keyof typeof ICONS];
            return (
              <motion.div
                key={agent.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "relative flex items-start gap-4 rounded-2xl border p-5 transition-colors duration-500",
                  state === "done"
                    ? "border-success/30 bg-success/[0.06]"
                    : state === "running"
                      ? "border-primary/50 bg-primary/[0.08]"
                      : "border-border bg-card/40",
                )}
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl border",
                    state === "done"
                      ? "border-success/40 bg-success/15 text-success"
                      : state === "running"
                        ? "border-primary/50 bg-primary/20 text-violet"
                        : "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {state === "done" ? (
                    <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }}>
                      <Check className="size-5" strokeWidth={3} />
                    </motion.span>
                  ) : state === "running" ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{agent.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{agent.description}</p>
                </div>
                <span className="shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
                  {state === "done" ? "done" : state === "running" ? "working" : "queued"}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
