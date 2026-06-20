from config import llm
from agent_state.agent_8 import PersonaFeedback

agent8_llm = llm.with_structured_output(PersonaFeedback)