from config import llm
from agent_state.agent_10 import FinalReport

agent10_llm = llm.with_structured_output(FinalReport)