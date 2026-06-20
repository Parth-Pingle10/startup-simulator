from langgraph.graph import StateGraph, START, END
from state import StartupState
from agent_node.agent_1 import startup_analyzer
from agent_node.agent_2 import competitor_finder
from agent_node.agent_3 import competitor_research_agent
from agent_node.agent_4 import competitor_intelligence_agent
from agent_node.agent_5 import market_gap_analysis_agent
from agent_node.agent_6 import startup_scoring_agent
from agent_node.agent_7 import persona_generator_agent
from agent_node.agent_8 import persona_simulation_agent
from agent_node.agent_9 import adoption_analytics_agent
from agent_node.agent_10 import final_report_generator_agent
# Create Graph
builder = StateGraph(StartupState)

# -----------------------------
# Add Nodes
# -----------------------------

builder.add_node(
    "startup_analyzer",
    startup_analyzer
)

builder.add_node(
    "competitor_finder",
    competitor_finder
)

builder.add_node(
    "competitor_research",
    competitor_research_agent
)

builder.add_node(
    "competitor_intelligence",
    competitor_intelligence_agent
)

builder.add_node(
    "market_gap_analysis",
    market_gap_analysis_agent
)

builder.add_node(
    "startup_scoring",
    startup_scoring_agent
)

builder.add_node(
    "persona_generator",
    persona_generator_agent
)

builder.add_node(
    "persona_simulation",
    persona_simulation_agent
)

builder.add_node(
    "adoption_analytics",
    adoption_analytics_agent
)

builder.add_node(
    "final_report_generator",
    final_report_generator_agent
)

# -----------------------------
# Connect Nodes
# -----------------------------

builder.add_edge(
    START,
    "startup_analyzer"
)

builder.add_edge(
    "startup_analyzer",
    "competitor_finder"
)

builder.add_edge(
    "competitor_finder",
    "competitor_research"
)

builder.add_edge(
    "competitor_research",
    "competitor_intelligence"
)

builder.add_edge(
    "competitor_intelligence",
    "market_gap_analysis"
)

builder.add_edge(
    "market_gap_analysis",
    "startup_scoring"
)

builder.add_edge(
    "startup_scoring",
    "persona_generator"
)

builder.add_edge(
    "persona_generator",
    "persona_simulation"
)

builder.add_edge(
    "persona_simulation",
    "adoption_analytics"
)

builder.add_edge(
    "adoption_analytics",
    "final_report_generator"
)

builder.add_edge(
    "final_report_generator",
    END
)

# -----------------------------
# Compile
# -----------------------------

graph = builder.compile()


# initial_state = {

#     "startup_name":
#     "FitAI",

#     "problem":
#     "Students struggle to stay consistent with workouts",

#     "solution":
#     "AI fitness coach",

#     "target_users":
#     "College students"

# }

# result = graph.invoke(
#     initial_state
# )

# print(
#     result["final_report"]
# )

from pprint import pprint

# ----------------------------------
# Initial State
# ----------------------------------

state = {
    "startup_name": "FitAI",
    "problem": "Students struggle to stay consistent with workouts",
    "solution": "AI fitness coach",
    "target_users": "College students"
}

# ----------------------------------
# Agent 1
# ----------------------------------

print("\n========== AGENT 1 ==========\n")

output = startup_analyzer(state)

state.update(output)

pprint(output)

# ----------------------------------
# Agent 2
# ----------------------------------

print("\n========== AGENT 2 ==========\n")

output = competitor_finder(state)

state.update(output)

pprint(output)

# ----------------------------------
# Agent 3
# ----------------------------------

print("\n========== AGENT 3 ==========\n")

output = competitor_research_agent(state)

state.update(output)

pprint(output)

# ----------------------------------
# Agent 4
# ----------------------------------

print("\n========== AGENT 4 ==========\n")

output = competitor_intelligence_agent(state)

state.update(output)

pprint(output)

# ----------------------------------
# Agent 5
# ----------------------------------

print("\n========== AGENT 5 ==========\n")

output = market_gap_analysis_agent(state)

state.update(output)

pprint(output)

# ----------------------------------
# Agent 6
# ----------------------------------

print("\n========== AGENT 6 ==========\n")

output = startup_scoring_agent(state)

state.update(output)

pprint(output)

# ----------------------------------
# Agent 7
# ----------------------------------

print("\n========== AGENT 7 ==========\n")

output = persona_generator_agent(state)

state.update(output)

pprint(output)

# ----------------------------------
# Agent 8
# ----------------------------------

print("\n========== AGENT 8 ==========\n")

output = persona_simulation_agent(state)

state.update(output)

pprint(output)

# ----------------------------------
# Agent 9
# ----------------------------------

print("\n========== AGENT 9 ==========\n")

output = adoption_analytics_agent(state)

state.update(output)

pprint(output)

# ----------------------------------
# Agent 10
# ----------------------------------

print("\n========== AGENT 10 ==========\n")

output = final_report_generator_agent(state)

state.update(output)

pprint(output)

# ----------------------------------
# Final State
# ----------------------------------

print("\n========== FINAL STATE ==========\n")

pprint(state)