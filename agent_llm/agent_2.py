from config import llm
from agent_state.agent_2 import CompetitorOutput

agent2_llm = llm.with_structured_output(
    CompetitorOutput
)