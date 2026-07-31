import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { inputClass } from "@/components/layout/AuthLayout";
import { createStartupAnalysis } from "@/lib/api/analysis";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analysis/new")({
  head: () => ({
    meta: [
      { title: "New analysis — AI Startup Simulator" },
      { name: "description", content: "Describe your startup idea and run a full AI analysis." },
      { property: "og:title", content: "New analysis — AI Startup Simulator" },
      { property: "og:description", content: "Four questions. One founder-grade report." },
    ],
  }),
  component: NewAnalysis,
});

const STEPS = [
  {
    key: "name" as const,
    label: "Startup name",
    question: "What are you calling it?",
    hint: "A working name is fine — you can change it later.",
    placeholder: "Loopline",
    long: false,
    min: 2,
  },
  {
    key: "problem" as const,
    label: "Problem",
    question: "What problem are you solving?",
    hint: "Be specific about who feels the pain and how often.",
    placeholder: "Ops teams lose hours reconciling work across five disconnected tools…",
    long: true,
    min: 20,
  },
  {
    key: "solution" as const,
    label: "Solution",
    question: "How does your product solve it?",
    hint: "One paragraph on the mechanism, not the vision.",
    placeholder: "An AI workspace that syncs and explains every cross-tool change…",
    long: true,
    min: 20,
  },
  {
    key: "targetUsers" as const,
    label: "Target users",
    question: "Who is it for?",
    hint: "Role, company size, segment — the more precise the better.",
    placeholder: "Operations leads at 10-200 person software companies",
    long: false,
    min: 8,
  },
];

function NewAnalysis() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [error, setError] = useState<string>();
  const [values, setValues] = useState({ name: "", problem: "", solution: "", targetUsers: "" });

  const current = STEPS[step];
  const value = values[current.key];

  async function next() {
    if (value.trim().length < current.min) {
      setError(`Please add a little more detail (${current.min}+ characters).`);
      return;
    }
    setError(undefined);
    if (step === STEPS.length - 1) {
      try {
        const response = await createStartupAnalysis({
          startup_name: values.name,
          problem: values.problem,
          solution: values.solution,
          target_users: values.targetUsers,
        });
        const analysisId = typeof response.analysis_id === "string" && response.analysis_id
          ? response.analysis_id
          : typeof response.data === "object" && response.data && "analysis_id" in response.data
            ? String((response.data as { analysis_id?: string }).analysis_id ?? "")
            : "";
        if (!analysisId) {
          throw new Error("The backend did not return an analysis id.");
        }
        navigate({ to: "/analysis/$id/progress", params: { id: analysisId } });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to start analysis";
        toast.error(message);
      }
      return;
    }
    setDir(1);
    setStep((s) => s + 1);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <p className="text-sm text-muted-foreground">Step {step + 1} of {STEPS.length}</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">New startup analysis</h1>

        <div className="mt-8 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-brand-gradient"
                  initial={false}
                  animate={{ width: i < step ? "100%" : i === step ? "45%" : "0%" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <p
                className={cn(
                  "mt-2 text-[11px]",
                  i <= step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {i < step && <Check className="mr-1 inline size-3 text-success" />}
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="surface mt-8 overflow-hidden p-7">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current.key}
              initial={{ opacity: 0, x: dir * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="text-xl font-semibold">{current.question}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{current.hint}</p>
              {current.long ? (
                <textarea
                  autoFocus
                  rows={5}
                  className={cn(inputClass, "mt-5 resize-none")}
                  placeholder={current.placeholder}
                  value={value}
                  onChange={(e) => setValues({ ...values, [current.key]: e.target.value })}
                />
              ) : (
                <input
                  autoFocus
                  className={cn(inputClass, "mt-5")}
                  placeholder={current.placeholder}
                  value={value}
                  onChange={(e) => setValues({ ...values, [current.key]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && next()}
                />
              )}
              {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
            </motion.div>
          </AnimatePresence>

          <div className="mt-7 flex items-center justify-between">
            <button
              onClick={() => {
                setDir(-1);
                setError(undefined);
                setStep((s) => Math.max(0, s - 1));
              }}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm transition-colors hover:bg-accent disabled:opacity-40"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            <button
              onClick={() => void next()}
              className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              {step === STEPS.length - 1 ? (
                <>
                  <Sparkles className="size-4" /> Run analysis
                </>
              ) : (
                <>
                  Continue <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
