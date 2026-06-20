# Startup Simulator AI

An AI-powered startup validation and market research system built using LangGraph, LangChain, Gemini, web scraping, and multi-agent workflows.

The goal of this project is to help founders validate startup ideas before investing significant time and money into development.

Instead of relying on intuition, the system performs competitor research, customer analysis, market gap detection, persona simulation, and startup scoring to generate a comprehensive startup validation report.

---

# Problem

Most founders build products without understanding:

- Existing competitors
- Customer frustrations
- Market demand
- Missing features
- Adoption probability
- Differentiation opportunities

This often leads to products nobody wants.

Startup Simulator attempts to solve this problem using AI agents and real-world competitor intelligence.

---

# Example Input

```json
{
  "startup_name": "FitAI",
  "problem": "Students struggle to stay consistent with workouts",
  "solution": "AI fitness coach",
  "target_users": "College students"
}
```

---

# System Architecture

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
Final Startup Report
```

---

# Features

- Multi-Agent Startup Validation
- Competitor Discovery
- Trustpilot Review Scraping
- Gemini-Powered Research Fallback
- Market Gap Analysis
- Customer Persona Generation
- Persona-Based Product Simulation
- Startup Scoring Engine
- Adoption Probability Estimation
- Professional Validation Reports

---

# Tech Stack

## AI

- LangChain
- LangGraph
- Gemini 2.5 Flash
- Pydantic Structured Outputs

## Scraping

- Playwright
- Trustpilot

## Backend

- Python

---

# Project Structure

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

# Workflow

## Agent 1 - Startup Analyzer

### Input

- Startup Name
- Problem
- Solution
- Target Users

### Output

- One-line startup description
- Key features

---

## Agent 2 - Competitor Finder

### Purpose

Find direct competitors solving the same problem for similar users.

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

Competitor → Trustpilot Search → Review Scraping

### Gemini Fallback Path

Competitor → Gemini Research → Competitor Intelligence

### Output

```python
{
    "competitor": "Fitbod",
    "source": "trustpilot",
    "review_count": 45,
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