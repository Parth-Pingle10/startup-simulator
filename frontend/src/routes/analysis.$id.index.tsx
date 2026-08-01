import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Globe, Lightbulb, Minus, Plus, Quote } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Meter, Pill, Reveal, Surface } from "@/components/kit";
import { ScoreRing } from "@/components/report/ScoreRing";
import { useAnalysis } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/analysis/$id/")({
  head: () => ({
    meta: [
      { title: "Analysis report — AI Startup Simulator" },
      { name: "description", content: "Your full startup report: score, competitors, personas and projections." },
      { property: "og:title", content: "Analysis report — AI Startup Simulator" },
      { property: "og:description", content: "Score, competitors, personas, gaps and growth projections." },
    ],
  }),
  component: ResultsPage,
});

const SECTIONS = [
  ["summary", "Summary"],
  ["competitors", "Competitors"],
  ["gaps", "Market gaps"],
  ["score", "Score"],
  ["personas", "Personas"],
  ["feedback", "Feedback"],
  ["analytics", "Validation"],
  ["actions", "Recommendations"],
] as const;

const chartTheme = {
  grid: "color-mix(in oklab, var(--foreground) 8%, transparent)",
  axis: "var(--muted-foreground)",
};

function ResultsPage() {
  const { id } = Route.useParams();
  const { analysis, hydrated } = useAnalysis(id);

  if (!hydrated)
    return (
      <AppShell>
        <div className="space-y-4">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </AppShell>
    );

  if (!analysis)
    return (
      <AppShell>
        <Surface className="text-center">
          <p className="text-muted-foreground">That report no longer exists.</p>
          <Link to="/history" className="mt-4 inline-block text-sm underline underline-offset-4">
            Back to history
          </Link>
        </Surface>
      </AppShell>
    );

  const a = analysis;

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{a.summary.industry}</p>
          <h1 className="mt-1 text-4xl font-semibold">{a.input.name}</h1>
        </div>
        <Pill tone="primary">
          Report generated {new Date(a.createdAt).toLocaleDateString()}
        </Pill>
      </div>

      <nav className="sticky top-16 z-30 -mx-5 mt-8 overflow-x-auto px-5 py-3 glass">
        <div className="flex gap-1">
          {SECTIONS.map(([key, label]) => (
            <a
              key={key}
              href={`#${key}`}
              className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* Summary */}
      <section id="summary" className="scroll-mt-32 pt-10">
        <Reveal>
          <Surface className="relative overflow-hidden">
            <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-brand-gradient opacity-15 blur-3xl" />
            <div className="relative grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <h2 className="text-xl font-semibold">Startup summary</h2>
                <p className="mt-3 text-lg leading-relaxed">{a.summary.oneLiner}</p>
                <div className="mt-6 grid gap-2">
                  {a.summary.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Plus className="mt-0.5 size-3.5 shrink-0 text-violet" /> {f}
                    </div>
                  ))}
                </div>
              </div>
              <ScoreRing value={a.score} />
            </div>
          </Surface>
        </Reveal>
      </section>

      {/* Competitors */}
      <section id="competitors" className="scroll-mt-32 pt-16">
        <h2 className="text-2xl font-semibold">Competitors</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {a.competitors.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.05}>
              <Surface hover className="h-full">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl border border-border bg-elevated font-display text-sm font-semibold">
                    {c.initials}
                  </span>
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Globe className="size-3" /> {c.website}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-success">Strengths</p>
                    {c.strengths.map((s) => (
                      <p key={s} className="mt-1.5 flex gap-2 text-sm text-muted-foreground">
                        <Plus className="mt-0.5 size-3.5 shrink-0 text-success" /> {s}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-warning">Weaknesses</p>
                    {c.weaknesses.map((s) => (
                      <p key={s} className="mt-1.5 flex gap-2 text-sm text-muted-foreground">
                        <Minus className="mt-0.5 size-3.5 shrink-0 text-warning" /> {s}
                      </p>
                    ))}
                  </div>
                </div>
              </Surface>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gaps */}
      <section id="gaps" className="scroll-mt-32 pt-16">
        <h2 className="text-2xl font-semibold">Market gaps</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {a.gaps.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.06}>
              <Surface hover className="h-full">
                <div className="flex items-center justify-between">
                  <Lightbulb className="size-5 text-warning" />
                  <Pill tone={g.opportunity === "High" ? "success" : "warning"}>
                    {g.opportunity} opportunity
                  </Pill>
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-snug">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.detail}</p>
              </Surface>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Score */}
      <section id="score" className="scroll-mt-32 pt-16">
        <h2 className="text-2xl font-semibold">Startup score</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-[auto_1fr]">
          <Surface className="flex flex-col items-center justify-center gap-6">
            <ScoreRing value={a.score} size={168} stroke={12} />
            <div className="w-full space-y-4">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Strength</span>
                  <span>{a.strengthMeter}</span>
                </div>
                <div className="mt-1.5">
                  <Meter value={a.strengthMeter} tone="success" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Weakness</span>
                  <span>{a.weaknessMeter}</span>
                </div>
                <div className="mt-1.5">
                  <Meter value={a.weaknessMeter} tone="warning" />
                </div>
              </div>
            </div>
          </Surface>
          <Surface>
            <div className="grid gap-5 sm:grid-cols-2">
              {a.scoreBreakdown.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{b.label}</span>
                    <span className="font-medium">{b.value}</span>
                  </div>
                  <div className="mt-2">
                    <Meter value={b.value} />
                  </div>
                  {b.reason ? (
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{b.reason}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </section>

      {/* Personas */}
      <section id="personas" className="scroll-mt-32 pt-16">
        <h2 className="text-2xl font-semibold">Personas</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {a.personas.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <Surface hover className="h-full">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-full bg-brand-gradient font-display text-sm font-semibold text-primary-foreground">
                    {p.avatar}
                  </span>
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.age} · {p.occupation}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">Goals</p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  {p.goals.map((g) => (
                    <li key={g} className="flex gap-2">
                      <Plus className="mt-0.5 size-3.5 shrink-0 text-success" /> {g}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">
                  Frustrations
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  {p.frustrations.map((g) => (
                    <li key={g} className="flex gap-2">
                      <Minus className="mt-0.5 size-3.5 shrink-0 text-warning" /> {g}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
                  {p.buying}
                </p>
              </Surface>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Feedback */}
      <section id="feedback" className="scroll-mt-32 pt-16">
        <h2 className="text-2xl font-semibold">Persona feedback</h2>
        <div className="relative mt-6 space-y-3 border-l border-border pl-8">
          {a.feedback.map((f, i) => (
            <Reveal key={f.persona} delay={i * 0.06}>
              <div className="group relative" tabIndex={0}>
                <span className="absolute -left-8 top-3 grid size-6 -translate-x-1/2 place-items-center rounded-full border border-border bg-elevated text-[10px] font-semibold">
                  {f.avatar}
                </span>
                <div className="overflow-hidden rounded-2xl border border-border bg-card/60 transition-all duration-300 hover:border-primary/40 hover:bg-card focus-within:border-primary/40">
                  <div className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                    <p className="text-sm font-medium">{f.persona}</p>
                  </div>
                  <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <div className="space-y-3 px-5 pb-5">
                        <Pill tone={f.sentiment > 75 ? "success" : "warning"}>
                          {f.sentiment}% positive
                        </Pill>
                        <p className="flex gap-2 text-[15px] leading-relaxed text-muted-foreground">
                          <Quote className="mt-1 size-4 shrink-0 text-violet" />
                          {f.quote}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Validation analytics */}
      <section id="analytics" className="scroll-mt-32 pt-16">
        <h2 className="text-2xl font-semibold">Validation analytics</h2>
        {a.validation?.executiveSummary ? (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {a.validation.executiveSummary}
          </p>
        ) : null}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Surface>
            <p className="font-medium">Projected user growth</p>
            <div className="mt-5 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={a.growth}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                  <XAxis dataKey="month" stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                    }}
                  />
                  <Area dataKey="users" stroke="var(--primary)" strokeWidth={2} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Surface>

          <Surface>
            <p className="font-medium">Adoption curve</p>
            <div className="mt-5 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={a.adoption}>
                  <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                  <XAxis dataKey="week" stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                    }}
                  />
                  <Line
                    dataKey="adoption"
                    stroke="var(--violet)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Surface>

          <Surface>
            <p className="font-medium">Validation probabilities</p>
            <div className="mt-5 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={a.market}>
                  <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                  <XAxis dataKey="label" stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "color-mix(in oklab, var(--foreground) 6%, transparent)" }}
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="value" fill="var(--cyan)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {a.market.map((m) => (
                <div key={m.label} className="rounded-xl bg-muted/50 p-3">
                  <p className="text-sm font-medium">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.note}</p>
                </div>
              ))}
            </div>
          </Surface>

          <Surface>
            <p className="font-medium">Revenue projection (USD)</p>
            <div className="mt-5 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={a.growth}>
                  <defs>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={chartTheme.grid} vertical={false} />
                  <XAxis dataKey="month" stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                    }}
                  />
                  <Area dataKey="revenue" stroke="var(--chart-4)" strokeWidth={2} fill="url(#g2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Surface>
        </div>

        {a.validation ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Surface>
              <p className="font-medium">Strengths & opportunities</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-success">Strengths</p>
                  {a.validation.strengths.map((item) => (
                    <p key={item} className="mt-1.5 flex gap-2 text-sm text-muted-foreground">
                      <Plus className="mt-0.5 size-3.5 shrink-0 text-success" /> {item}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-violet">Opportunities</p>
                  {a.validation.opportunities.map((item) => (
                    <p key={item} className="mt-1.5 flex gap-2 text-sm text-muted-foreground">
                      <Plus className="mt-0.5 size-3.5 shrink-0 text-violet" /> {item}
                    </p>
                  ))}
                </div>
              </div>
            </Surface>
            <Surface>
              <p className="font-medium">Risks & barriers</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-warning">Weaknesses</p>
                  {a.validation.weaknesses.map((item) => (
                    <p key={item} className="mt-1.5 flex gap-2 text-sm text-muted-foreground">
                      <Minus className="mt-0.5 size-3.5 shrink-0 text-warning" /> {item}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-warning">Adoption barriers</p>
                  {a.validation.barriers.map((item) => (
                    <p key={item} className="mt-1.5 flex gap-2 text-sm text-muted-foreground">
                      <Minus className="mt-0.5 size-3.5 shrink-0 text-warning" /> {item}
                    </p>
                  ))}
                </div>
              </div>
            </Surface>
            <Surface>
              <p className="font-medium">Customer signals</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Most liked</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {a.validation.mostLikedFeatures.join(" · ") || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Most requested</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {a.validation.mostRequestedFeatures.join(" · ") || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Top concerns</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {a.validation.topConcerns.join(" · ") || "—"}
                  </p>
                </div>
              </div>
            </Surface>
            <Surface>
              <p className="font-medium">Persona outlook</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-success">Early adopters</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {a.validation.earlyAdopters.join(" · ") || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-warning">Undecided</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {a.validation.undecided.join(" · ") || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-destructive">Likely rejectors</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {a.validation.rejectors.join(" · ") || "—"}
                  </p>
                </div>
                {a.validation.finalVerdict ? (
                  <p className="rounded-xl bg-muted/60 p-3 text-sm text-muted-foreground">
                    {a.validation.finalVerdict}
                  </p>
                ) : null}
              </div>
            </Surface>
          </div>
        ) : null}
      </section>

      {/* Recommendations */}
      <section id="actions" className="scroll-mt-32 pt-16">
        <h2 className="text-2xl font-semibold">Final recommendations</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {a.recommendations.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.05}>
              <Surface hover className="h-full">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone={r.priority === "Critical" ? "danger" : r.priority === "High" ? "primary" : "neutral"}>
                    {r.priority} priority
                  </Pill>
                  <Pill tone={r.risk === "High" ? "warning" : r.risk === "Medium" ? "neutral" : "success"}>
                    <AlertTriangle className="size-3" /> {r.risk} risk
                  </Pill>
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-snug">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.detail}</p>
                <div className="mt-5 space-y-2 border-t border-border pt-4">
                  {r.actions.map((act) => (
                    <p key={act} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-violet" /> {act}
                    </p>
                  ))}
                </div>
              </Surface>
            </Reveal>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
