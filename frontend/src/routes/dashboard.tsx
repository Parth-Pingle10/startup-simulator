import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, History, Plus, Sparkles, TrendingUp, User } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Surface } from "@/components/kit";
import { AnalysisCard } from "@/components/report/ScoreRing";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthSession } from "@/lib/hooks/use-auth";
import { useAnalysisList } from "@/lib/services/analysis-service";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Startup Simulator" },
      { name: "description", content: "Your startup analyses, scores and quick actions." },
      { property: "og:title", content: "Dashboard — AI Startup Simulator" },
      { property: "og:description", content: "Track every idea you've pressure-tested." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { items, hydrated } = useAnalysisList();
  const { session } = useAuthSession();
  const runtimes = items
    .map((i) => Number(i.total_runtime) || 0)
    .filter((n) => n > 0);
  const avgMinutes = runtimes.length
    ? Math.round((runtimes.reduce((a, b) => a + b, 0) / runtimes.length / 60) * 10) / 10
    : 0;
  const best = items.length ? Math.max(...items.map((i) => (i.status === "completed" ? 100 : 0))) : 0;

  const stats = [
    { label: "Total analyses", value: items.length, hint: "across all ideas" },
    { label: "Average runtime", value: avgMinutes.toFixed(1), hint: "minutes" },
    { label: "Completed", value: best, hint: "completed reports" },
  ];

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="mt-2 text-4xl font-semibold">
          {session ? `Good to see you, ${session.name.split(" ")[0]}.` : "Good to see you."}
        </h1>
        <p className="mt-3 max-w-lg text-muted-foreground">
          Pick up an existing thesis or put a new idea through the simulator.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <Surface className="relative overflow-hidden">
              <div className="pointer-events-none absolute -right-8 -top-10 size-28 rounded-full bg-brand-gradient opacity-[0.18] blur-2xl" />
              <p className="text-sm text-muted-foreground">{s.label}</p>
              {hydrated ? (
                <p className="mt-2 font-display text-4xl font-semibold">{s.value}</p>
              ) : (
                <Skeleton className="mt-3 h-9 w-16" />
              )}
              <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>
            </Surface>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent analyses</h2>
            <Link
              to="/history"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {!hydrated && [0, 1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
            {hydrated && items.length === 0 && (
              <Surface className="text-center">
                <p className="text-muted-foreground">No analyses yet.</p>
                <Link
                  to="/analysis/new"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-medium text-primary-foreground"
                >
                  <Plus className="size-4" /> Run your first analysis
                </Link>
              </Surface>
            )}
            {items.slice(0, 3).map((a, i) => {
              const isComplete = a.status === "completed";
              const isPaused = a.status === "paused";
              const isRunning = a.status === "running";
              const score = isComplete ? Number(a.total_runtime ?? 0) : 0;
              const analysis = {
                id: a.analysis_id,
                input: { name: a.startup_name, problem: "", solution: "", targetUsers: "" },
                createdAt: Date.parse(a.created_at ?? new Date().toISOString()),
                status: isComplete ? "complete" : "running",
                score: score || 0,
                summary: {
                  oneLiner: a.startup_name,
                  industry: isComplete ? "Completed analysis" : isPaused ? "Paused" : isRunning ? "Running" : "Pending",
                  features: [],
                },
                competitors: [],
                gaps: [],
                scoreBreakdown: [],
                strengthMeter: 0,
                weaknessMeter: 0,
                personas: [],
                feedback: [],
                growth: [],
                adoption: [],
                market: [],
                recommendations: [],
                validation: null,
              };
              return <AnalysisCard key={a.analysis_id} analysis={analysis} index={i} />;
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick actions</h2>
          <Link
            to="/analysis/new"
            className="group relative block overflow-hidden rounded-2xl border border-primary/40 p-6 transition-transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-brand-gradient opacity-20 transition-opacity group-hover:opacity-30" />
            <div className="relative">
              <Sparkles className="size-5 text-violet" />
              <p className="mt-4 text-lg font-semibold">Create New Analysis</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Four questions, forty-five seconds, one report.
              </p>
            </div>
          </Link>
          {[
            { to: "/history", icon: History, title: "Analysis history", body: "Search and reopen past reports" },
            { to: "/profile", icon: User, title: "Profile & settings", body: "Account, theme and session" },
          ].map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/40"
            >
              <q.icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="font-medium">{q.title}</p>
                <p className="text-sm text-muted-foreground">{q.body}</p>
              </div>
            </Link>
          ))}
          <Surface className="flex items-start gap-3">
            <TrendingUp className="mt-0.5 size-5 shrink-0 text-success" />
            <p className="text-sm text-muted-foreground">
              Ideas re-analyzed after a pivot gain an average of 11 points.
            </p>
          </Surface>
        </div>
      </div>
    </AppShell>
  );
}
