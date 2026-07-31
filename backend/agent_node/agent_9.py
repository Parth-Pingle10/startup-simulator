from backend.agent_state.agent_9 import AdoptionAnalytics
from backend.utils.structured_invoke import invoke_structured
from backend.utils.logger import logger
from backend.utils.agent_runner import run_agent 
import time

async def adoption_analytics_agent(state):
   
   async def execute():
      
      logger.info(
         f"Agent 9 Started | {state['startup_name']}"
      )
      
      logger.info(
    f"Persona Feedback Length: {len(str(state['persona_feedback']))} characters"
)

      prompt = f"""
     You are an expert product strategist and customer insights analyst.

Your task is to aggregate customer validation results.

The persona feedback has already been generated.

Do NOT re-simulate personas.

Do NOT invent new opinions.

Only analyze the provided structured customer feedback.

--------------------------------------------------

Persona Feedback

{state["persona_feedback"]}

--------------------------------------------------

Analyze the feedback and determine:

1. Overall Adoption Probability

Calculate using:

• Would Use
• Adoption Scores

2. Payment Probability

Calculate using:

• Would Pay
• Adoption Scores

3. Recommendation Probability

Calculate using:

• Would Recommend

4. Average Adoption Score

5. Most Liked Features

Rank by frequency.

6. Most Requested Features

Rank by frequency.

7. Most Common Concerns

Rank by frequency.

8. Biggest Adoption Barriers

Focus on:

• Deal Breakers

• Purchase Decisions

• Customer Concerns

9. Preferred Competitors

Identify:

• Which competitors were preferred most often

• Why customers preferred them

10. Likely Early Adopters

Identify personas with:

High adoption

Positive purchase decision

Positive recommendation

11. Undecided Personas

Identify personas that require more convincing.

12. Likely Rejectors

Identify personas with:

Low adoption

Negative purchase decision

Strong objections

13. Product Improvement Priorities

Rank the improvements that would have the greatest impact on adoption.

--------------------------------------------------

Rules

• Base every conclusion only on the provided persona feedback.

• Count recurring themes.

• Ignore isolated opinions.

• Do not invent statistics.

• Keep insights concise.

• Return structured output only.
      """

      response = await invoke_structured(
      AdoptionAnalytics,
      prompt
   )

      if isinstance(response, dict):

         analytics = response

      else:

         analytics = response.model_dump()
         
      
      logger.info(
         f"Agent 9 Completed | {state['startup_name']}"
      )

      return {
         "adoption_analytics": analytics
      }
   
   return await run_agent(
        state,
        9,
        execute
    )