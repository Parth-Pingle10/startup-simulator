import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpRight, Trash2 } from "lucide-react";
import type { Analysis } from "@/lib/mock";
import { cn } from "@/lib/utils";

export function ScoreRing({
  value,
  size = 132,
  stroke = 10,
  label = "Score",
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`ring-${size}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="55%" stopColor="var(--violet)" />
            <stop offset="100%" stopColor="var(--cyan)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="stroke-muted"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          stroke={`url(#ring-${size})`}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (c * value) / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-3xl font-semibold">{value}</p>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function AnalysisCard({
  analysis,
  onDelete,
  index = 0,
}: {
  analysis: Analysis;
  onDelete?: (id: string) => void;
  index?: number;
}) {
  const date = new Date(analysis.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative"
    >
      <Link
        to="/analysis/$id"
        params={{ id: analysis.id }}
        className="surface block p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
      >
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-semibold">{analysis.input.name}</h3>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {analysis.summary.industry} · {date}
            </p>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {analysis.input.problem}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p
              className={cn(
                "font-display text-3xl font-semibold",
                analysis.score >= 80
                  ? "text-success"
                  : analysis.score >= 65
                    ? "text-foreground"
                    : "text-warning",
              )}
            >
              {analysis.score}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">score</p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <button
          onClick={() => onDelete(analysis.id)}
          aria-label={`Delete ${analysis.input.name}`}
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-lg border border-border bg-background/80 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </motion.div>
  );
}
