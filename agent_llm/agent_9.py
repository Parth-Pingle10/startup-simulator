from config import llm
from agent_state.agent_9 import AdoptionAnalytics

agent9_llm = llm.with_structured_output(AdoptionAnalytics)