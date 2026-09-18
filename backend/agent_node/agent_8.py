from backend.agent_state.agent_8 import (
    PersonaFeedbackOutput
)

from backend.utils.structured_invoke import (
    invoke_structured
)

from backend.utils.logger import (
    logger
)
from backend.utils.agent_runner import run_agent
import time


async def persona_simulation_agent(
    state
):

    async def execute():
        logger.info(
            f"Agent 8 Started | {state['startup_name']}"
        )

        prompt = f"""
You are simulating a startup customer validation panel.

You will receive multiple customer personas.

Each persona represents a unique individual with different:

• Goals
• Motivations
• Lifestyle
• Budget
• Technical confidence
• Decision-making style
• Buying behaviour
• Product expectations

Your job is to independently roleplay EACH persona and evaluate the startup from ONLY that persona's perspective.

Do NOT act as a startup consultant.

Do NOT provide market analysis.

Do NOT average opinions across personas.

Every persona must think independently.

--------------------------------------------------

Startup

Name:
{state["startup_name"]}

Description:
{state["one_line_description"]}

Problem:
{state["problem"]}

Solution:
{state["solution"]}

Key Features:
{state["key_features"]}

--------------------------------------------------

Competitive Landscape

Competitor Intelligence:
{state.get("competitor_insights", "")}

Market Gap Analysis:
{state.get("market_gaps", "")}


--------------------------------------------------

Customer Personas

{state["personas"]}

--------------------------------------------------

For EACH persona:

Imagine you have just discovered this startup.

Evaluate it exactly as that persona would after comparing it with existing alternatives.

Your evaluation should be based ONLY on:

• Goals
• Frustrations
• Budget
• Technical confidence
• Buying behaviour
• Product expectations
• Competitor offerings

Ignore every other persona.

--------------------------------------------------

Provide the following for EVERY persona:

1. Persona Name

2. Would Use
Choose ONE:
• Yes
• Maybe
• No

3. Adoption Score
(Integer between 0 and 100)

4. Would Pay
Choose ONE:
• Yes
• Maybe
• No

5. Would Recommend
Choose ONE:
• Yes
• Maybe
• No

6. Top 3 Liked Features

7. Top 3 Concerns

8. Missing Features

9. Biggest Adoption Reason

10. Biggest Deal Breaker

11. Purchase Decision

Choose ONE:

• Buy Immediately
• Try Free Version
• Wait For Improvements
• Compare With Competitors
• Not Interested

12. Competitor Preference

If another competitor would be chosen instead of this startup, provide:

• Preferred Competitor
• Reason

Otherwise return:

Startup Preferred

13. Customer Review

Write ONE realistic customer review.

Maximum 70 words.

Write exactly as the persona would naturally speak.

--------------------------------------------------

Scoring Guide

0–20
Would never use.

21–40
Highly unlikely.

41–60
Needs convincing.

61–80
Likely customer.

81–100
Strong early adopter.

--------------------------------------------------

Rules

• Stay completely in character.
• Every persona should produce different opinions.
• Budget-conscious personas should focus on price.
• Privacy-conscious personas should focus on trust.
• Beginners should focus on ease of use.
• Experts should focus on advanced capabilities.
• Skeptical users should require convincing evidence.
• Traditional users should naturally resist switching.
• Use competitor information only when it genuinely influences the decision.
• Keep answers concise.
• Never write long paragraphs.
• Return structured output only.
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