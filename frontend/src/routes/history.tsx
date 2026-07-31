import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Surface } from "@/components/kit";
import { AnalysisCard } from "@/components/report/ScoreRing";
import { inputClass } from "@/components/layout/AuthLayout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAnalysisList, removeAnalysis } from "@/lib/services/analysis-service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Analysis history — AI Startup Simulator" },
      { name: "description", content: "Search, reopen and manage every analysis you've run." },
      { property: "og:title", content: "Analysis history — AI Startup Simulator" },
      { property: "og:description", content: "Every idea you've pressure-tested, in one place." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { items, hydrated, refresh } = useAnalysisList();
  const [q, setQ] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const filtered = items.filter((a) =>
    `${a.startup_name}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold">History</h1>
          <p className="mt-2 text-muted-foreground">Every idea you've put through the simulator.</p>
        </div>
        <Link
          to="/analysis/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          <Plus className="size-4" /> New analysis
        </Link>
      </div>

      <div className="relative mt-8">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, problem or industry…"
          className={cn(inputClass, "pl-11")}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {!hydrated && [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        {hydrated &&
          filtered.map((a, i) => (
            <AnalysisCard
              key={a.analysis_id}
              analysis={{
                id: a.analysis_id,
                input: { name: a.startup_name, problem: "", solution: "", targetUsers: "" },
                createdAt: Date.parse(a.created_at ?? new Date().toISOString()),
                status: a.status === "completed" ? "complete" : "running",
                score: a.status === "completed" ? 85 : 60,
                summary: { oneLiner: a.startup_name, industry: "Live backend analysis", features: [] },
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
              }}
              index={i}
              onDelete={setPending}
            />
          ))}
      </div>

      {hydrated && filtered.length === 0 && (
        <Surface className="mt-6 text-center">
          <p className="text-muted-foreground">
            {items.length === 0 ? "No analyses yet." : "No analyses match that search."}
          </p>
        </Surface>
      )}

      <AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this analysis?</AlertDialogTitle>
            <AlertDialogDescription>
              The report and its data will be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (pending) {
                  await removeAnalysis(pending);
                  refresh();
                }
                setPending(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
