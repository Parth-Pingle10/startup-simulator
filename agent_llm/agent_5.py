from config import llm 
from agent_state.agent_5 import MarketGapAnalysis
agent5_llm = llm.with_structured_output(MarketGapAnalysis)