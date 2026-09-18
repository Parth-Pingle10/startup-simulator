from langgraph.graph import StateGraph, START, END
from backend.state import StartupState
from backend.agent_node.agent_1 import startup_analyzer
from backend.agent_node.agent_2 import competitor_finder
from backend.agent_node.agent_3 import competitor_research_agent
from backend.agent_node.agent_4 import competitor_intelligence_agent
from backend.agent_node.agent_5 import market_gap_analysis_agent
from backend.agent_node.agent_6 import startup_scoring_agent
from backend.agent_node.agent_7 import persona_generator_agent
from backend.agent_node.agent_8 import persona_simulation_agent
from backend.agent_node.agent_9 import adoption_analytics_agent
from backend.agent_node.agent_10 import final_report_generator_agent


builder = StateGraph(StartupState)

# ----------------------------------------------------
# 1. Add all 10 Agent Nodes (Separate nodes for 5 and 6)
# ----------------------------------------------------
builder.add_node("startup_analyzer", startup_analyzer)
builder.add_node("competitor_finder", competitor_finder)
builder.add_node("competitor_research", competitor_research_agent)
builder.add_node("competitor_intelligence", competitor_intelligence_agent)
builder.add_node("market_gap_analysis", market_gap_analysis_agent)
builder.add_node("startup_scoring", startup_scoring_agent)
builder.add_node("persona_generator", persona_generator_agent)
builder.add_node("persona_simulation", persona_simulation_agent)
builder.add_node("adoption_analytics", adoption_analytics_agent)
builder.add_node("final_report_generator", final_report_generator_agent)

# ----------------------------------------------------
# 2. Sequential Start: Agent 1 -> Agent 2
# ----------------------------------------------------
builder.add_edge(START, "startup_analyzer")
builder.add_edge("startup_analyzer", "competitor_finder")

# ----------------------------------------------------
# 3. Parallel Fan-Out after Agent 2:
#    - Branch A: Competitor Analysis (Agent 3 -> 4 -> 5 -> 6)
#    - Branch B: Persona Validation (Agent 7 -> 8)
# ----------------------------------------------------
builder.add_edge("competitor_finder", "competitor_research")
builder.add_edge("competitor_finder", "persona_generator")

# ----------------------------------------------------
# 4. Branch A: Sequential Flow (Agent 3 -> 4 -> 5 -> 6)
# ----------------------------------------------------
builder.add_edge("competitor_research", "competitor_intelligence")
builder.add_edge("competitor_intelligence", "market_gap_analysis")
builder.add_edge("market_gap_analysis", "startup_scoring")

# ----------------------------------------------------
# 5. Branch B: Sequential Flow (Agent 7 -> 8)
# ----------------------------------------------------
builder.add_edge("persona_generator", "persona_simulation")

# ----------------------------------------------------
# 6. Synchronization Barrier: Agent 9 waits for BOTH Agent 6 and Agent 8
# ----------------------------------------------------
def check_branches_synced(state: StartupState) -> str:
    """Ensure Agent 9 runs only after both Branch A (Agent 6) and Branch B (Agent 8) complete."""
    if state.get("startup_score") and state.get("persona_feedback"):
        return "adoption_analytics"
    return END

builder.add_conditional_edges(
    "startup_scoring",
    check_branches_synced,
    {"adoption_analytics": "adoption_analytics", END: END},
)
builder.add_conditional_edges(
    "persona_simulation",
    check_branches_synced,
    {"adoption_analytics": "adoption_analytics", END: END},
)

# ----------------------------------------------------
# 7. Final Recommendations & Completion: Agent 9 -> 10 -> END
# ----------------------------------------------------
builder.add_edge("adoption_analytics", "final_report_generator")
builder.add_edge("final_report_generator", END)

graph = builder.compile()