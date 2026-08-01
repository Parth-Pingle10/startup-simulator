from backend.agent_state.agent_10 import StartupRecommendations
from backend.utils.structured_invoke import invoke_structured
from backend.utils.logger import logger 
import time
from backend.utils.agent_runner import run_agent
async def final_report_generator_agent(state):
        
    async def execute():
    
        logger.info(
            f"Agent 10 Started | {state['startup_name']}"
        )

        validation = (
            state.get("startup_validation_report")
            or state.get("adoption_analytics")
            or {}
        )

        prompt = f"""
        You are a senior startup advisor, VC, product strategist and founder coach.

Your task is NOT to evaluate the startup again.

The startup has already been analyzed.

Your responsibility is ONLY to generate actionable recommendations for the founder.

Base every recommendation ONLY on the provided validation report.

Do NOT invent new analysis.

Do NOT contradict previous findings.

--------------------------------------------------

Startup Validation Report

{validation}

--------------------------------------------------

Generate recommendations in the following sections.

1. Strategic Recommendations

Provide the highest-impact recommendations.

Rank them by priority.

--------------------------------------------------

2. Product Improvements

Recommend improvements that directly address

• Customer concerns

• Adoption barriers

• Weaknesses

--------------------------------------------------

3. MVP Features

Recommend features that should exist before launch.

--------------------------------------------------

4. Future Features

Recommend features suitable after product-market fit.

--------------------------------------------------

5. Pricing Strategy

Suggest a pricing approach based on customer feedback.

--------------------------------------------------

6. Go-To-Market Strategy

Recommend the best launch approach.

--------------------------------------------------

7. Marketing Strategy

Recommend

• Acquisition channels

• Messaging

• Positioning

--------------------------------------------------

8. Launch Strategy

Describe

• Validation steps

• Beta launch

• MVP rollout

--------------------------------------------------

9. Investment Readiness

Choose one

• Not Ready

• Early Validation Needed

• Ready for MVP Funding

• Ready for Seed Funding

Explain briefly.

--------------------------------------------------

10. Next Steps

Provide practical founder actions.

Rank by priority.

--------------------------------------------------

Rules

• Every recommendation must be supported by the supplied report.

• Focus on practical actions.

• Avoid repetition.

• Keep recommendations concise.

• Return structured output only.
        """

        response = await invoke_structured(
        StartupRecommendations,
        prompt
    )

        if isinstance(response, dict):

            report = response

        else:

            report = response.model_dump()
        
            
        logger.info(
            f"Agent 10 Completed | {state['startup_name']}"
        )


        return {
            "final_report": report,
            "startup_recommendations": report,
        }
    
    return await run_agent(
        state,
        10,
        execute
    )