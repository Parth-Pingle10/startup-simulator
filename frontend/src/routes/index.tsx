import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  Compass,
  Gauge,
  MessageSquareQuote,
  Radar,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import heroOrb from "@/assets/hero-orb.jpg";
import { Logo } from "@/components/layout/AppShell";
import { Eyebrow, Reveal, SectionHeading, Surface } from "@/components/kit";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Startup Simulator — Pressure-test your idea in minutes" },
      {
        name: "description",
        content:
          "Nine AI analysts research your market, score your idea, interview synthetic buyers and hand you a founder-grade report.",
      },
      { property: "og:title", content: "AI Startup Simulator" },
      {
        property: "og:description",
        content: "Nine AI analysts turn your startup idea into an investor-grade report in minutes.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Radar,
    title: "Competitor intelligence",
    body: "Direct and adjacent players surfaced with positioning, strengths and the cracks you can walk through.",
  },
  {
    icon: Compass,
    title: "Market gap mapping",
    body: "Unclaimed territory ranked by opportunity, so you know exactly where to aim your first release.",
  },
  {
    icon: Gauge,
    title: "Startup score",
    body: "Eight weighted dimensions from problem clarity to defensibility, with the reasoning behind each number.",
  },
  {
    icon: Users,
    title: "Synthetic buyers",
    body: "Personas built from your target segment, each with real goals, frustrations and buying behaviour.",
  },
  {
    icon: MessageSquareQuote,
    title: "Persona interviews",
    body: "Read what your future customers say about your pitch before you spend a dollar acquiring them.",
  },
  {
    icon: BarChart3,
    title: "Adoption modelling",
    body: "Growth curves, TAM/SAM/SOM and revenue projections you can drop straight into a deck.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Describe the idea",
    body: "Four questions. Name, problem, solution, who it is for. Two minutes, no deck required.",
  },
  {
    n: "02",
    title: "Watch the agents work",
    body: "Nine specialised analysts run in sequence — research, scoring, personas, analytics — live on screen.",
  },
  {
    n: "03",
    title: "Act on the report",
    body: "A prioritised set of recommendations with risk levels and action items you can ship this week.",
  },
];

const WHY = [
  "Kill weak ideas in an afternoon instead of a quarter",
  "Walk into investor meetings with defensible numbers",
  "Find the wedge your competitors left open",
  "Hear objections before your first sales call",
  "Turn a hunch into a written, shareable thesis",
  "Re-run it every time the idea evolves",
];

const FAQ = [
  {
    q: "How long does one analysis take?",
    a: "About forty-five seconds end to end. You watch each agent finish in real time and the report opens automatically.",
  },
  {
    q: "What do I need to prepare?",
    a: "Nothing. Four short answers about your idea is enough — the agents handle research, scoring and modelling.",
  },
  {
    q: "Is this a replacement for talking to customers?",
    a: "No. It is the step before. Synthetic personas surface the obvious objections so your real conversations go deeper.",
  },
  {
    q: "Can I re-run an idea after changing it?",
    a: "Yes. Every run is saved to your history so you can compare how the score moves as the thesis sharpens.",
  },
  {
    q: "Who is it for?",
    a: "Pre-seed and seed founders, product leaders validating a new line, and operators exploring a spin-out.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-5">
          <Logo />
          <nav className="ml-auto hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
          </nav>
          <div className="ml-auto flex items-center gap-2 md:ml-7">
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-brand-gradient px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-[520px] bg-[radial-gradient(50%_70%_at_50%_0%,color-mix(in_oklab,var(--primary)_28%,transparent),transparent)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-28">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Eyebrow>
                <span className="size-1.5 rounded-full bg-success" /> Nine AI analysts, one report
              </Eyebrow>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="mt-6 text-5xl font-semibold leading-[1.03] sm:text-6xl lg:text-[4.25rem]"
            >
              Know if your startup
              <br />
              <span className="text-gradient">works before you build it.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground"
            >
              Describe your idea in four lines. A team of AI agents researches the market, scores
              viability, interviews synthetic buyers and returns a founder-grade report — in under a
              minute.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/analysis/new"
                className="group inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-[15px] font-medium text-primary-foreground glow transition-transform hover:scale-[1.03]"
              >
                Analyze Your Startup
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3.5 text-[15px] transition-colors hover:bg-accent"
              >
                See how it works
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted-foreground"
            >
              {["No credit card", "45 second run", "Shareable report"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <Check className="size-4 text-success" /> {t}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="animate-float relative mx-auto aspect-square w-full max-w-[460px]">
              <img
                src={heroOrb}
                width={1280}
                height={1280}
                alt=""
                className="size-full rounded-[2rem] object-cover opacity-90"
              />
              <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-border" />
            </div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -left-2 top-10 rounded-2xl border border-border glass px-4 py-3 sm:-left-8"
            >
              <p className="text-xs text-muted-foreground">Startup score</p>
              <p className="font-display text-2xl font-semibold text-gradient">87</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75 }}
              className="absolute -right-2 bottom-12 max-w-[220px] rounded-2xl border border-border glass px-4 py-3 sm:-right-6"
            >
              <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Brain className="size-3.5 text-violet" /> Persona feedback
              </p>
              <p className="mt-1 text-[13px] leading-snug">
                "Give me a real free tier and I'll bring the whole studio."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <SectionHeading
            eyebrow="What you get"
            title="A full research team, running in parallel"
            subtitle="Every agent contributes one section of the final report. Nothing is generic — each output is written against your specific idea."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <Surface hover className="h-full">
                <span className="grid size-11 place-items-center rounded-xl border border-primary/30 bg-primary/12">
                  <f.icon className="size-5 text-violet" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </Surface>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative border-y border-border/60 bg-card/30 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="Idea in. Thesis out."
              subtitle="Three steps, no setup, no onboarding call."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="relative h-full rounded-2xl border border-border bg-background/60 p-7">
                  <span className="font-display text-5xl font-semibold text-gradient opacity-80">
                    {s.n}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Why founders use it"
              title="Conviction, faster than a research sprint"
              subtitle="Most founders spend six weeks and a small budget learning what a structured analysis reveals in an afternoon."
            />
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-4">
              <ShieldCheck className="size-5 shrink-0 text-success" />
              <p className="text-sm text-muted-foreground">
                Every claim in the report is traceable to the agent that produced it.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2">
            {WHY.map((w, i) => (
              <Reveal key={w} delay={i * 0.05}>
                <div className="flex h-full items-start gap-3 rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/40">
                  <Zap className="mt-0.5 size-4 shrink-0 text-violet" />
                  <p className="text-sm leading-relaxed">{w}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-24">
        <Reveal>
          <SectionHeading center eyebrow="FAQ" title="Questions founders ask" />
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`i${i}`}
                className="rounded-2xl border border-border bg-card/50 px-5"
              >
                <AccordionTrigger className="text-left text-[15px] font-medium hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border p-12 text-center">
            <div className="pointer-events-none absolute inset-0 bg-brand-gradient opacity-20" />
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
            <div className="relative">
              <h2 className="text-3xl font-semibold sm:text-4xl">
                Your next idea deserves a second opinion.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Run your first analysis free and see the report in under a minute.
              </p>
              <Link
                to="/analysis/new"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-[15px] font-medium text-background transition-transform hover:scale-[1.03]"
              >
                Analyze Your Startup <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center">
          <Logo />
          <p className="text-sm text-muted-foreground sm:ml-6">
            Simulated research for founders. Not investment advice.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground sm:ml-auto">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
            <Link to="/login" className="hover:text-foreground">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
