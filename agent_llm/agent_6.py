from config import llm
from agent_state.agent_6 import StartupScore

agent6_llm = llm.with_structured_output(StartupScore)