from backend.agent_state.agent_9 import StartupValidationReport
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
    You are an experienced startup consultant and customer insights analyst.

Your task is to generate the final startup validation report.

The previous agents have already completed:

• Competitor Research
• Competitor Intelligence
• Market Gap Analysis
• Startup Scoring
• Persona Generation
• Persona Validation

Do NOT perform new research.

Do NOT invent information.

Every conclusion must be directly supported by the supplied inputs.

--------------------------------------------------

Startup Name

{state["startup_name"]}

Startup Description

{state["one_line_description"]}

Key Features

{state["key_features"]}

Competitor Insights

{state["competitor_insights"]}

Market Gap Analysis

{state["market_gaps"]}

Startup Score

{state["startup_score"]}

Persona Feedback

{state["persona_feedback"]}

--------------------------------------------------

Generate a structured startup validation report.

Include:

1. Executive Summary

Provide a concise summary describing:

• Overall startup potential

• Market readiness

• Customer reception

Maximum 150 words.

--------------------------------------------------

2. Startup Overview

Briefly describe

• What the startup does

• Target users

• Core value proposition

--------------------------------------------------

3. Market Validation

Summarize

• Market demand

• Competitive positioning

• Market opportunities

--------------------------------------------------

4. Customer Validation

Summarize

• Overall customer reactions

• Buying intent

• Adoption likelihood

--------------------------------------------------

5. Startup Strengths

List the strongest recurring strengths.

--------------------------------------------------

6. Startup Weaknesses

List the biggest weaknesses.

--------------------------------------------------

7. Market Opportunities

List recurring opportunities.

--------------------------------------------------

8. Market Threats

List recurring risks.

--------------------------------------------------

9. Adoption Analytics

Estimate:

• Adoption Probability (0-100)

• Payment Probability (0-100)

• Recommendation Probability (0-100)

• Average Adoption Score (0-100)

--------------------------------------------------

10. Most Liked Features

Rank by frequency.

--------------------------------------------------

11. Most Requested Features

Rank by frequency.

--------------------------------------------------

12. Top Customer Concerns

Rank by frequency.

--------------------------------------------------

13. Biggest Adoption Barriers

Rank by importance.

--------------------------------------------------

14. Preferred Competitors

List competitors preferred most frequently.

--------------------------------------------------

15. Customer Segmentation

Identify

• Early Adopters

• Undecided Personas

• Likely Rejectors

--------------------------------------------------

16. Final Verdict

Choose EXACTLY ONE

• Do Not Build

• Pivot Recommended

• Proceed With Caution

• Build MVP

• Strong Opportunity

--------------------------------------------------

Rules

• Do not invent data.

• Aggregate recurring patterns.

• Ignore isolated opinions.

• Keep answers concise.

• Return structured output only.
      """

      response = await invoke_structured(
      StartupValidationReport,
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
         "adoption_analytics": analytics,
         "startup_validation_report": analytics,
      }
   
   return await run_agent(
        state,
        9,
        execute
    )