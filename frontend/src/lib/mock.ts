export type AnalysisInput = {
  name: string;
  problem: string;
  solution: string;
  targetUsers: string;
};

export type Competitor = {
  name: string;
  initials: string;
  description: string;
  website: string;
  strengths: string[];
  weaknesses: string[];
};

export type Persona = {
  name: string;
  age: number;
  occupation: string;
  avatar: string;
  goals: string[];
  frustrations: string[];
  buying: string;
};

export type Feedback = { persona: string; avatar: string; quote: string; sentiment: number };

export type Recommendation = {
  title: string;
  detail: string;
  priority: "Critical" | "High" | "Medium";
  risk: "High" | "Medium" | "Low";
  actions: string[];
};

export type Analysis = {
  id: string;
  input: AnalysisInput;
  createdAt: number;
  status: "running" | "complete";
  score: number;
  summary: { oneLiner: string; industry: string; features: string[] };
  competitors: Competitor[];
  gaps: { title: string; detail: string; opportunity: "High" | "Medium" }[];
  scoreBreakdown: { label: string; value: number }[];
  strengthMeter: number;
  weaknessMeter: number;
  personas: Persona[];
  feedback: Feedback[];
  growth: { month: string; users: number; revenue: number }[];
  adoption: { week: string; adoption: number }[];
  market: { label: string; value: number; note: string }[];
  recommendations: Recommendation[];
};

export const AGENTS = [
  {
    key: "analysis",
    title: "Startup Analysis",
    description: "Parsing your idea into a structured product thesis",
    icon: "Sparkles",
    seconds: 4,
  },
  {
    key: "competitors",
    title: "Competitor Discovery",
    description: "Scanning the landscape for direct and adjacent players",
    icon: "Radar",
    seconds: 5,
  },
  {
    key: "research",
    title: "Competitor Research",
    description: "Reading positioning, pricing and product depth",
    icon: "Search",
    seconds: 6,
  },
  {
    key: "gaps",
    title: "Market Gap Analysis",
    description: "Finding unclaimed territory you can own",
    icon: "Compass",
    seconds: 5,
  },
  {
    key: "score",
    title: "Startup Score",
    description: "Scoring viability across eight weighted dimensions",
    icon: "Gauge",
    seconds: 4,
  },
  {
    key: "personas",
    title: "Persona Generation",
    description: "Synthesising the buyers most likely to convert",
    icon: "Users",
    seconds: 5,
  },
  {
    key: "feedback",
    title: "Persona Feedback",
    description: "Interviewing each persona about your pitch",
    icon: "MessageSquare",
    seconds: 6,
  },
  {
    key: "adoption",
    title: "Adoption Analytics",
    description: "Modelling growth, TAM/SAM/SOM and revenue",
    icon: "TrendingUp",
    seconds: 5,
  },
  {
    key: "report",
    title: "Final Report",
    description: "Assembling recommendations and next actions",
    icon: "FileText",
    seconds: 4,
  },
] as const;

export const TOTAL_SECONDS = AGENTS.reduce((a, s) => a + s.seconds, 0);

const rand = (seed: string) => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
};

export function buildAnalysis(input: AnalysisInput, id: string = crypto.randomUUID()): Analysis {
  const r = rand(input.name + input.problem);
  const pick = <T>(arr: T[]) => arr[Math.floor(r() * arr.length)];
  const score = 62 + Math.floor(r() * 30);
  const industries = [
    "B2B SaaS · Productivity",
    "Vertical AI · Operations",
    "Fintech Infrastructure",
    "Developer Tools",
    "Marketplace · SMB",
  ];

  return {
    id,
    input,
    createdAt: Date.now(),
    status: "complete",
    score,
    summary: {
      oneLiner: `${input.name} helps ${input.targetUsers.toLowerCase()} solve ${input.problem
        .toLowerCase()
        .replace(/\.$/, "")} with ${input.solution.toLowerCase().replace(/\.$/, "")}.`,
      industry: pick(industries),
      features: [
        "Guided onboarding that maps existing workflows in minutes",
        "AI copilot that drafts, reviews and explains every decision",
        "Collaborative workspace with granular roles and audit trail",
        "Native integrations with the tools the team already pays for",
        "Usage analytics that prove ROI to the budget holder",
      ],
    },
    competitors: [
      {
        name: "Northloop",
        initials: "NL",
        description:
          "Incumbent workflow suite with deep enterprise penetration and a slow release cadence.",
        website: "northloop.com",
        strengths: ["Trusted brand in enterprise", "Broad integration catalog"],
        weaknesses: ["Dated UX", "12-week implementation cycles"],
      },
      {
        name: "Kestrel AI",
        initials: "KA",
        description: "Well-funded AI-native challenger targeting mid-market operations teams.",
        website: "kestrel.ai",
        strengths: ["Strong AI narrative", "$42M Series B momentum"],
        weaknesses: ["Thin data model", "Pricing opaque below 200 seats"],
      },
      {
        name: "Fathom Works",
        initials: "FW",
        description: "Bootstrapped tool loved by small teams for its speed and simplicity.",
        website: "fathomworks.io",
        strengths: ["Delightful product craft", "Self-serve funnel"],
        weaknesses: ["No enterprise controls", "Limited reporting depth"],
      },
      {
        name: "Orbit Grid",
        initials: "OG",
        description: "Horizontal platform bundling this category into a larger operations cloud.",
        website: "orbitgrid.com",
        strengths: ["Bundled pricing power", "Large partner network"],
        weaknesses: ["Shallow in this category", "Slow support response"],
      },
    ],
    gaps: [
      {
        title: "Nobody serves the 10–50 person team well",
        detail:
          "Incumbents price for enterprise and simple tools stop scaling at 10 seats. That band is growing 24% YoY and is underserved.",
        opportunity: "High",
      },
      {
        title: "Explainability is an afterthought",
        detail:
          "Competing AI features output answers without reasoning. Buyers repeatedly cite trust as the blocker to rollout.",
        opportunity: "High",
      },
      {
        title: "Time-to-first-value is measured in weeks",
        detail:
          "The category average onboarding is 19 days. A same-session first result would be a durable wedge.",
        opportunity: "Medium",
      },
    ],
    scoreBreakdown: [
      { label: "Problem clarity", value: Math.min(98, score + 9) },
      { label: "Market timing", value: Math.min(96, score + 5) },
      { label: "Differentiation", value: Math.max(40, score - 8) },
      { label: "Willingness to pay", value: Math.min(94, score + 2) },
      { label: "Go-to-market fit", value: Math.max(45, score - 5) },
      { label: "Defensibility", value: Math.max(38, score - 14) },
      { label: "Team leverage", value: Math.min(92, score + 4) },
      { label: "Capital efficiency", value: Math.min(95, score + 7) },
    ],
    strengthMeter: Math.min(95, score + 6),
    weaknessMeter: Math.max(18, 100 - score - 12),
    personas: [
      {
        name: "Maya Okonkwo",
        age: 34,
        occupation: "Head of Operations, 40-person SaaS",
        avatar: "MO",
        goals: ["Cut manual coordination", "Prove impact to the CEO", "Onboard the team in a week"],
        frustrations: ["Tool sprawl", "Nothing works without a consultant", "Reporting is manual"],
        buying: "Runs a two-week trial with her team, then buys annual if adoption clears 60%.",
      },
      {
        name: "Daniel Reyes",
        age: 41,
        occupation: "VP Product, Series B fintech",
        avatar: "DR",
        goals: ["Faster decision cycles", "Fewer status meetings", "Auditable trail"],
        frustrations: ["Vendor lock-in", "AI outputs he cannot verify", "Security review overhead"],
        buying: "Needs SOC 2 and a security questionnaire before procurement will sign.",
      },
      {
        name: "Priya Nair",
        age: 28,
        occupation: "Founder, 8-person studio",
        avatar: "PN",
        goals: ["Punch above weight", "Keep spend under control", "Ship without hiring"],
        frustrations: ["Enterprise pricing", "Long onboarding", "Features she never uses"],
        buying: "Self-serve, card on file, will churn instantly if value is not obvious in week one.",
      },
    ],
    feedback: [
      {
        persona: "Maya Okonkwo",
        avatar: "MO",
        quote:
          "If this really maps my existing process instead of asking me to rebuild it, I would trial it this quarter. The demo has to show my workflow, not a generic one.",
        sentiment: 82,
      },
      {
        persona: "Daniel Reyes",
        avatar: "DR",
        quote:
          "The AI angle is interesting but I need to see why it reached a conclusion. Show me the reasoning and the sources or my team will not trust it.",
        sentiment: 64,
      },
      {
        persona: "Priya Nair",
        avatar: "PN",
        quote:
          "I love that I can start alone. The moment I hit a 'contact sales' wall I am gone. Give me a real free tier and I will bring the whole studio.",
        sentiment: 88,
      },
    ],
    growth: Array.from({ length: 12 }, (_, i) => ({
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
      users: Math.round(140 * Math.pow(1.38, i)),
      revenue: Math.round(140 * Math.pow(1.38, i) * 27),
    })),
    adoption: Array.from({ length: 10 }, (_, i) => ({
      week: `W${i * 4 + 1}`,
      adoption: Math.round(100 / (1 + Math.exp(-(i - 4.5) * 0.75))),
    })),
    market: [
      { label: "TAM", value: 8400, note: "Global spend in adjacent categories" },
      { label: "SAM", value: 1900, note: "English-speaking mid-market" },
      { label: "SOM", value: 210, note: "Realistic 3-year capture" },
    ],
    recommendations: [
      {
        title: "Ship an explainability layer before launch",
        detail:
          "Trust is the single most cited blocker across personas. Surfacing sources and reasoning converts skeptics into champions.",
        priority: "Critical",
        risk: "High",
        actions: [
          "Add a reasoning panel to every AI output",
          "Publish a model and data transparency page",
          "Instrument trust surveys in-product",
        ],
      },
      {
        title: "Own the 10–50 seat band with self-serve pricing",
        detail:
          "The clearest gap in the market. Land bottom-up, expand into the accounts incumbents ignore.",
        priority: "High",
        risk: "Medium",
        actions: [
          "Launch a real free tier with a usage ceiling",
          "Remove contact-sales gates below 50 seats",
          "Add seat-based expansion prompts",
        ],
      },
      {
        title: "Compress time-to-first-value under 10 minutes",
        detail:
          "Category average is 19 days. A same-session first result becomes your headline claim and your retention driver.",
        priority: "High",
        risk: "Low",
        actions: [
          "Prefill a sample workspace at signup",
          "Track activation event by cohort",
          "Cut onboarding steps from 7 to 3",
        ],
      },
      {
        title: "Start the SOC 2 clock now",
        detail:
          "Every enterprise persona blocked on security review. Readiness takes months and gates your largest deals.",
        priority: "Medium",
        risk: "Medium",
        actions: ["Select a compliance vendor", "Assign an internal owner", "Publish a trust center"],
      },
    ],
  };
}

export const DEMO_INPUTS: AnalysisInput[] = [
  {
    name: "Loopline",
    problem: "Ops teams lose hours reconciling work across five disconnected tools",
    solution: "An AI workspace that syncs and explains every cross-tool change",
    targetUsers: "Operations leads at 10-200 person software companies",
  },
  {
    name: "Palette",
    problem: "Small brands cannot afford a design team for daily creative",
    solution: "A brand-aware generator that ships on-brand assets in seconds",
    targetUsers: "Founders and marketers at DTC brands",
  },
  {
    name: "Ledgerly",
    problem: "Freelancers dread quarterly tax prep and miss deductions",
    solution: "Always-on bookkeeping copilot wired to bank feeds",
    targetUsers: "Independent consultants and creators",
  },
];
