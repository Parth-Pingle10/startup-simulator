from config import llm
from agent_state.agent_4 import CompetitorAnalysis

agent4_llm = llm.with_structured_output(CompetitorAnalysis)