from agent_state.agent_8 import (
    PersonaFeedbackOutput
)

from utils.structured_invoke import (
    invoke_structured
)

from utils.logger import (
    logger
)

import time


def persona_simulation_agent(
    state
):

    start = time.time()

    logger.info(
        f"Agent 8 Started | {state['startup_name']}"
    )

    prompt = f"""
    YOUR BIG PERSONA PROMPT
    """

    response = invoke_structured(
        PersonaFeedbackOutput,
        prompt
    )

    end = time.time()

    logger.info(
        f"Agent 8 Completed | {state['startup_name']}"
    )

    logger.info(
        f"Agent 8 Runtime: {end-start:.2f}s"
    )

    if isinstance(
        response,
        dict
    ):
        return response

    return {

        "persona_feedback":

        [
            feedback.model_dump()

            for feedback in
            response.persona_feedback
        ]
    }