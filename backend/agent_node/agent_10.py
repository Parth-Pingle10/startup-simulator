from backend.agent_state.agent_10 import FinalReport
from backend.utils.structured_invoke import invoke_structured
from backend.utils.logger import logger 
import time
from backend.utils.agent_runner import run_agent
async def final_report_generator_agent(state):
        
    async def execute():
    
        logger.info(
            f"Agent 10 Started | {state['startup_name']}"
        )

        prompt = f"""
        You are an experienced startup consultant preparing the final startup validation report for a founder.

All analysis has already been completed by previous specialist agents.

Your responsibility is ONLY to synthesize the provided findings into a professional, concise, and actionable report.

Do NOT perform new analysis.

Do NOT invent new insights.

Do NOT generate conclusions that are not supported by the provided information.

Every statement must be traceable to the supplied inputs.

--------------------------------------------------

Startup Information

Startup Name:
{state["startup_name"]}

Startup Description:
{state["one_line_description"]}

Key Features:
{state["key_features"]}

Market Analysis:
{state["market_gaps"]}

Startup Score:
{state["startup_score"]}

Customer Validation Summary:
{state["adoption_analytics"]}

--------------------------------------------------

Generate a founder-friendly report containing the following sections.

1. Executive Summary

Provide a concise overview of:

• Startup potential
• Overall market validation
• Biggest strengths
• Biggest risks
• Overall outlook

Keep this section under 150 words.

--------------------------------------------------

2. Startup Overview

Briefly describe:

• What the startup does
• Who it serves
• Core value proposition
• Primary differentiator

--------------------------------------------------

3. Strengths

Summarize the startup's strongest competitive advantages based ONLY on the provided market analysis and customer validation.

Do not invent additional strengths.

--------------------------------------------------

4. Weaknesses

Summarize the biggest weaknesses, limitations, and unresolved customer concerns.

Focus only on recurring issues identified in previous analysis.

--------------------------------------------------

5. Opportunities

Summarize the most promising market opportunities.

Prioritize opportunities that appear repeatedly across the market analysis and customer validation.

--------------------------------------------------

6. Threats

Summarize the major competitive and market risks.

Focus on practical threats that could affect adoption.

--------------------------------------------------

7. Strategic Recommendations

Provide actionable recommendations for improving the startup.

Recommendations should directly address:

• Customer concerns
• Missing features
• Adoption barriers
• Competitive weaknesses

Rank recommendations by expected impact.

--------------------------------------------------

8. Final Verdict

Choose EXACTLY ONE:

• Do Not Build
• Pivot Recommended
• Proceed With Caution
• Build MVP
• Strong Opportunity

The verdict must be consistent with:

• Startup Score
• Market Fit
• Customer Validation
• Market Opportunities
• Risks

--------------------------------------------------

9. Recommended Next Steps

Provide practical actions for the founder.

Examples include:

• Build MVP
• Validate pricing
• Improve onboarding
• Add requested features
• Conduct customer interviews
• Expand target audience
• Improve differentiation

Rank them in order of priority.

--------------------------------------------------

Writing Guidelines

• Write professionally but keep the language easy to understand.
• Be concise.
• Avoid repetition.
• Do not copy text from previous outputs.
• Convert analytical findings into actionable business insights.
• Every recommendation must be supported by the supplied analysis.
• Keep the report suitable for presentation to founders or investors.

Return structured output only.
        """

        response = await invoke_structured(
        FinalReport,
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
            "final_report": report
        }
    
    return await run_agent(
        state,
        10,
        execute
    )