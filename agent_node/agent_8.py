from concurrent.futures import (
    ThreadPoolExecutor
)

from agent_state.agent_8 import (
    PersonaFeedback
)

from utils.structured_invoke import (
    invoke_structured
)

from utils.logger import (
    logger
)

import time


def evaluate_persona(
    persona,
    state
):

    prompt = f"""
         You are roleplaying as the following customer persona.

Persona:
{persona}

You MUST think, behave, and make decisions exactly like this persona.

Do NOT act as an analyst.

Do NOT act as a startup advisor.

Do NOT try to help the startup succeed.

Your only goal is to determine whether YOU, as this persona, would actually use this product.

Startup:
{state["startup_name"]}

Description:
{state["one_line_description"]}

Features:
{state["key_features"]}

Startup Score:
{state["startup_score"]}

Market Gaps:
{state["market_gaps"]}

Evaluation Instructions:

Analyze the startup from the perspective of the persona only.

Consider:

* Personal goals
* Frustrations
* Budget constraints
* Technical comfort level
* Current alternatives
* Existing habits
* Motivations
* Concerns

Decision Rules:

If the persona is skeptical:

* Be difficult to convince.
* Focus on weaknesses.
* Challenge assumptions.

If the persona is budget-conscious:

* Focus heavily on pricing and value.

If the persona is a power user:

* Compare against existing competitors.
* Demand advanced functionality.

If the persona is a casual user:

* Prioritize simplicity and convenience.

If the persona has low adoption likelihood:

* Default toward rejection unless there is a strong reason to adopt.

Important:

Do NOT automatically approve the startup.

It is acceptable to:

* Reject the startup.
* Refuse to pay.
* Refuse to recommend it.
* Criticize missing features.

Provide:

1. Would you use this startup?
2. Adoption score (0-100)
3. Would you pay for it?
4. Would you recommend it?
5. Favorite feature
6. Most important missing feature
7. Main concerns
8. Detailed feedback written in the first person as the persona

Scoring Guidelines:

0-20:
Would never use.

21-40:
Unlikely to use.

41-60:
Possibly interested.

61-80:
Likely to use.

81-100:
Highly likely to use.

Return structured output only.
        """

    response = invoke_structured(
        PersonaFeedback,
        prompt
    )

    if isinstance(
        response,
        dict
    ):
        return response

    return response.model_dump()


def persona_simulation_agent(
    state
):

    start = time.time()

    logger.info(
        f"Agent 8 Started | {state['startup_name']}"
    )

    personas = (
        state["personas"]
    )

    try:

        with ThreadPoolExecutor(
            max_workers=3
        ) as executor:

            persona_feedback = list(
                executor.map(
                    lambda persona:
                    evaluate_persona(
                        persona,
                        state
                    ),
                    personas
                )
            )

    except Exception as e:

        logger.error(
            f"Agent 8 Failed | {str(e)}"
        )

        raise

    end = time.time()

    logger.info(
        f"Agent 8 Completed | {state['startup_name']}"
        
    )

    logger.info(
        f"Agent 8 Runtime: {end-start:.2f}s"
    )

    logger.info(
        f"Personas Evaluated: {len(persona_feedback)}"
    )

    return {
        "persona_feedback":
        persona_feedback
    }