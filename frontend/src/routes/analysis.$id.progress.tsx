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
import { useEffect, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ScoreRing } from "@/components/report/ScoreRing";
import { AGENTS } from "@/lib/mock";
import { useAnalysisProgress } from "@/lib/services/analysis-service";
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
  isDone: boolean,
) {
  if (isDone) return AGENTS.length;

  if (currentAgent) {
    const byName = AGENTS.findIndex(
      (a) => a.title.toLowerCase() === currentAgent.trim().toLowerCase(),
    );
    if (byName >= 0) return byName;
  }

  // Backend progress is 10, 20, … 100 when each agent starts
  if (progressPct > 0) {
    return Math.min(AGENTS.length - 1, Math.max(0, Math.ceil(progressPct / 10) - 1));
  }

  return 0;
}

function ProgressPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { progress } = useAnalysisProgress(id);

  const done = Boolean(progress?.status === "completed" || progress?.progress === 100);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => navigate({ to: "/analysis/$id", params: { id } }), 900);
    return () => clearTimeout(t);
  }, [done, id, navigate]);

  const currentIdx = useMemo(
    () => resolveCurrentAgentIndex(progress?.current_agent, progress?.progress ?? 0, done),
    [progress?.current_agent, progress?.progress, done],
  );

  const states = AGENTS.map((_, i) => {
    if (done || i < currentIdx) return "done";
    if (i === currentIdx) return "running";
    return "queued";
  });

  const pct = Math.min(100, Math.round(progress?.progress ?? (done ? 100 : 0)));
  const runningTitle = done ? null : AGENTS[currentIdx]?.title;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="surface flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
          <ScoreRing value={pct} size={112} label="complete" />
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold sm:text-3xl">
              {done ? "Report ready" : "Your analysis is running"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {done
                ? "Opening your report…"
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
                  {state === "running" && (
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-brand-gradient"
                        initial={{ width: "15%" }}
                        animate={{ width: ["15%", "85%"] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  )}
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
