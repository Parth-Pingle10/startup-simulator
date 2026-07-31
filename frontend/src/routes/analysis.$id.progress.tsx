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
import { useEffect, useMemo, useState } from "react";
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
      { name: "description", content: "Watch nine AI agents research and score your startup live." },
      { property: "og:title", content: "Running analysis — AI Startup Simulator" },
      { property: "og:description", content: "Nine specialised agents, running live." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [elapsed, setElapsed] = useState(0);
  const { progress } = useAnalysisProgress(id);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 0.25), 250);
    return () => clearInterval(t);
  }, []);

  const done = Boolean(progress?.status === "completed" || progress?.progress === 100);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => navigate({ to: "/analysis/$id", params: { id } }), 900);
    return () => clearTimeout(t);
  }, [done, id, navigate]);

  const totalSeconds = useMemo(() => AGENTS.reduce((acc, a) => acc + a.seconds, 0), []);

  let acc = 0;
  const states = AGENTS.map((a) => {
    const start = acc;
    acc += a.seconds;
    return elapsed >= acc ? "done" : elapsed >= start ? "running" : "queued";
  });

  const pct = Math.min(100, Math.round((progress?.progress ?? 0) || (elapsed / totalSeconds) * 100));
  const remaining = Math.max(0, Math.ceil(totalSeconds - elapsed));

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
                : progress?.current_agent
                  ? `Current step: ${progress.current_agent}`
                  : `Nine agents at work. About ${remaining}s remaining — you can keep this tab open.`}
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
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: agent.seconds, ease: "linear" }}
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
