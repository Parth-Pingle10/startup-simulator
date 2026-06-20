from config import llm
from agent_state.agent_7 import PersonaOutput

agent7_llm = llm.with_structured_output(PersonaOutput)