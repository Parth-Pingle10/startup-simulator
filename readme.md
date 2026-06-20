# 🚀 Startup Simulator AI

An AI-powered startup validation platform that simulates market research, competitor analysis, customer feedback, and startup evaluation using a multi-agent architecture built with LangGraph and Gemini.

---

# 🎯 Goal

Most founders build products without validating:

- Market demand
- Competitor weaknesses
- Customer frustrations
- Feature gaps
- Adoption probability
- Monetization potential

Startup Simulator acts as a virtual:

- Market Researcher
- Product Manager
- Customer Panel
- Startup Consultant
- Investor

to evaluate startup ideas before development.

---

# ✨ Features

## Competitor Discovery

Automatically finds direct competitors based on:

- Problem
- Solution
- Target users
- Product features

## Competitor Research

Uses:

- Trustpilot scraping
- Gemini fallback research

to collect customer opinions and product intelligence.

## Customer Intelligence

Extracts:

- Strengths
- Weaknesses
- Pain points
- Feature requests
- Target users

from competitor data.

## Market Gap Analysis

Identifies:

- Opportunities
- Threats
- Solved pain points
- Unsolved pain points

## Startup Scoring

Evaluates:

- Market Fit
- Differentiation
- Problem Strength
- Monetization Potential
- Execution Complexity

## Customer Persona Simulation

Creates realistic customer segments and simulates:

- Adoption behavior
- Payment behavior
- Recommendation behavior

## Startup Validation Report

Generates a complete founder-ready report with:

- Strengths
- Weaknesses
- Opportunities
- Threats
- Recommendations
- Final Verdict

---

# 🏗 Architecture

```text
User Startup Idea
        │
        ▼
Agent 1
Startup Analyzer
        │
        ▼
Agent 2
Competitor Finder
        │
        ▼
Agent 3
Competitor Research
        │
        ▼
Agent 4
Competitor Intelligence
        │
        ▼
Agent 5
Market Gap Analysis
        │
        ▼
Agent 6
Startup Scoring
        │
        ▼
Agent 7
Persona Generator
        │
        ▼
Agent 8
Persona Simulation
        │
        ▼
Agent 9
Adoption Analytics
        │
        ▼
Agent 10
Final Report Generator
```

---

# 📦 Project Structure

```text
project/

├── agent_node/
│   ├── agent_1.py
│   ├── agent_2.py
│   ├── agent_3.py
│   ├── agent_4.py
│   ├── agent_5.py
│   ├── agent_6.py
│   ├── agent_7.py
│   ├── agent_8.py
│   ├── agent_9.py
│   └── agent_10.py
│
├── scraper/
│   └── trustpilot.py
│
├── utils/
│   └── competitor_research.py
│
├── state.py
├── graph.py
├── config.py
├── main.py
├── requirements.txt
└── README.md
```

---

# 🧠 State Structure

```python
class StartupState(TypedDict):

    startup_name: str
    problem: str
    solution: str
    target_users: str

    one_line_description: str
    key_features: list[str]

    competitors: list

    competitor_research: list

    competitor_insights: list

    market_gaps: dict

    startup_score: dict

    personas: list

    persona_feedback: list

    adoption_analytics: dict

    final_report: dict
```

---

# 🤖 Agent Overview

## Agent 1 - Startup Analyzer

### Input

- Startup Name
- Problem
- Solution
- Target Users

### Output

- One-line Description
- Key Features

---

## Agent 2 - Competitor Finder

Finds the strongest direct competitors.

### Output

```python
[
    "Fitbod",
    "Freeletics",
    "Aaptiv",
    "Sworkit",
    "Nike Training Club"
]
```

---

## Agent 3 - Competitor Research

### Trustpilot Path

```text
Competitor
    ↓
Trustpilot Search
    ↓
Review Scraping
```

### Gemini Fallback Path

```text
Competitor
    ↓
Gemini Research
```

### Output

```python
{
    "competitor": "Fitbod",
    "source": "trustpilot",
    "review_count": 40,
    "reviews": [...]
}
```

or

```python
{
    "competitor": "Fitbod",
    "source": "llm_research",
    "strengths": [...],
    "weaknesses": [...],
    "pain_points": [...],
    "feature_requests": [...]
}
```

---

## Agent 4 - Competitor Intelligence

Converts reviews into structured market intelligence.

Extracts:

- Strengths
- Weaknesses
- Pain Points
- Feature Requests
- Target Users

---

## Agent 5 - Market Gap Analysis

Compares startup against competitors.

Finds:

- Strengths
- Opportunities
- Threats
- Solved Pain Points
- Unsolved Pain Points

---

## Agent 6 - Startup Scoring

Evaluates:

- Market Fit
- Differentiation
- Problem Strength
- Monetization
- Execution Complexity

---

## Agent 7 - Persona Generator

Creates 15 realistic customer personas.

Includes:

- Early Adopters
- Practical Buyers
- Budget Users
- Skeptics
- Rejectors

---

## Agent 8 - Persona Simulation

Each persona independently evaluates the startup.

Questions:

- Would Use?
- Would Pay?
- Would Recommend?
- Favorite Feature?
- Missing Feature?
- Concerns?

---

## Agent 9 - Adoption Analytics

Aggregates persona feedback.

Calculates:

- Adoption Probability
- Payment Probability
- Recommendation Probability
- Average Adoption Score

Identifies:

- Most Requested Features
- Top Concerns
- Early Adopters
- Rejectors

---

## Agent 10 - Final Report Generator

Produces a professional startup validation report.

Sections:

- Executive Summary
- Startup Overview
- Strengths
- Weaknesses
- Opportunities
- Threats
- Customer Insights
- Recommendations
- Final Verdict
- Next Steps

---

# ⚙️ Installation

```bash
git clone <repo>

cd startup-simulator

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

---

# 🔑 Environment Variables

Create a `.env` file.

```env
GOOGLE_API_KEY=YOUR_API_KEY
```

---

# ▶️ Run

```bash
python main.py
```

---

# 📝 Example Input

```python
state = {
    "startup_name": "FitAI",
    "problem": "Students struggle to stay consistent with workouts",
    "solution": "AI fitness coach",
    "target_users": "College students"
}
```

---

# 📊 Example Output

```python
{
    "market_fit_score": 78,
    "adoption_probability": 72,
    "payment_probability": 64,
    "recommendation_probability": 70,
    "verdict": "Build MVP"
}
```

---

# 🔮 Future Improvements

- Reddit Scraping
- Google Search Integration
- Product Hunt Analysis
- SWOT Matrix Generation
- Radar Charts
- PDF Report Export
- Pitch Deck Generator
- Business Model Evaluation
- Pricing Strategy Simulation
- Investor Debate Agents
- Competitor Feature Matrix
- Startup Idea Optimizer

---

# 📄 License

MIT License