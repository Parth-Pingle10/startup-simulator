from config import llm
from agent_state.agent_1 import StartupAnalysis

agent1_llm = llm.with_structured_output(
    StartupAnalysis
)