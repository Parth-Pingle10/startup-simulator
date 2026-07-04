from agent_state.agent_8 import (
    PersonaFeedbackOutput
)

from utils.structured_invoke import (
    invoke_structured
)

from utils.logger import (
    logger
)
from utils.agent_runner import run_agent
import time


async def persona_simulation_agent(
    state
):

    async def execute():
        logger.info(
            f"Agent 8 Started | {state['startup_name']}"
        )

        prompt = f"""
You are simulating a customer validation panel.

You will receive multiple customer personas.

Each persona represents a completely different individual with different:

* Goals
* Motivations
* Habits
* Frustrations
* Budget constraints
* Technical skills
* Adoption behavior

Your task is to independently roleplay EACH persona and evaluate the startup from THEIR perspective.

IMPORTANT:

Do NOT act as a startup advisor.

Do NOT act as a business consultant.

Do NOT evaluate the startup objectively.

Do NOT average opinions across personas.

Do NOT attempt to help the startup succeed.

You must fully roleplay each persona individually.

Treat every persona as if they are unaware of the opinions of the other personas.

A skeptical persona must remain skeptical.

A budget-conscious persona must focus heavily on value and cost.

A power user must compare against existing alternatives and demand advanced functionality.

A casual user must prioritize simplicity and convenience.

A resistant or low-adoption persona should reject the startup unless there is a compelling reason to adopt.

It is completely acceptable for personas to:

* Reject the startup
* Refuse to pay
* Refuse to recommend it
* Criticize missing features
* Highlight major concerns

Startup:

Name:
{state["startup_name"]}

Description:
{state["one_line_description"]}

Features:
{state["key_features"]}

Startup Score:
{state["startup_score"]}

Market Gaps:
{state["market_gaps"]}

Personas:

{state["personas"]}

Evaluation Process:

For EACH persona:

1. Carefully analyze the startup from the perspective of that persona only.

2. Consider:

* Personal goals
* Existing habits
* Current alternatives
* Frustrations
* Budget limitations
* Technical comfort level
* Motivations
* Adoption barriers
* Concerns

3. Decide whether that specific persona would realistically use the startup.

4. Do not allow the startup score to dominate the decision.

5. Use the startup score only as a supporting signal.

6. The final decision must be driven primarily by the persona profile.

Provide the following for EVERY persona:

1. Persona Name
2. Would Use (true/false)
3. Adoption Score (0-100)
4. Would Pay (true/false)
5. Would Recommend (true/false)
6. Favorite Feature
7. Most Important Missing Feature
8. Main Concerns
9. Detailed Feedback

Detailed Feedback Rules:

* Write in first person.
* Speak as the persona.
* Be realistic.
* Mention specific reasons.
* Mention tradeoffs.
* Mention competing alternatives if relevant.
* Mention why the startup does or does not fit the persona's needs.

Scoring Guidelines:

0-20
Would never use.

21-40
Unlikely to use.

41-60
Possibly interested.

61-80
Likely to use.

81-100
Highly likely to use.

Generate feedback for ALL personas.

Return structured output only.
        """

        response = await invoke_structured(
            PersonaFeedbackOutput,
            prompt
        )


        logger.info(
            f"Agent 8 Completed | {state['startup_name']}"
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
    
    return await run_agent(
        state,
        8,
        execute
    )