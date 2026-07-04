from agent_state.agent_10 import FinalReport
from utils.structured_invoke import invoke_structured
from utils.logger import logger 
import time
from utils.agent_runner import run_agent
async def final_report_generator_agent(state):
        
    async def execute():
    
        logger.info(
            f"Agent 10 Started | {state['startup_name']}"
        )

        prompt = f"""
        You are an experienced startup consultant preparing a professional startup validation report for a founder.

    Your task is to summarize and communicate the findings from previous analysis.

    Do NOT perform new analysis.

    Do NOT invent new insights.

    Do NOT generate new opportunities, threats, strengths, or weaknesses.

    Use ONLY the information provided.

    Startup Name:
    {state["startup_name"]}

    Description:
    {state["one_line_description"]}

    Features:
    {state["key_features"]}

    Competitors:
    {state["competitors"]}

    Competitor Insights:
    {state["competitor_insights"]}

    Market Gap Analysis:
    {state["market_gaps"]}

    Startup Score:
    {state["startup_score"]}

    Adoption Analytics:
    {state["adoption_analytics"]}

    Persona Feedback:
    {state["persona_feedback"]}

    Report Objectives:

    Create a concise, professional, founder-friendly report.

    The report should clearly communicate:

    * What the startup does
    * How it compares to competitors
    * Where opportunities exist
    * What customers think
    * What risks exist
    * What should happen next

    Create the following sections:

    1. Executive Summary

    Provide a concise summary of the startup's market potential, major strengths, key risks, and overall outlook.

    2. Startup Overview

    Summarize the startup, target users, and value proposition.

    3. Key Strengths

    Summarize strengths identified in previous analysis.

    4. Key Weaknesses

    Summarize weaknesses and limitations identified in previous analysis.

    5. Market Opportunities

    Summarize opportunities identified in market gap analysis.

    6. Competitive Threats

    Summarize threats and competitive risks.

    7. Customer Insights

    Summarize:

    * Adoption probability
    * Recommendation probability
    * Payment probability
    * Most requested features
    * Major concerns
    * Strongest selling points

    8. Strategic Recommendations

    Provide actionable recommendations based ONLY on identified weaknesses, opportunities, and customer feedback.

    9. Final Verdict

    Provide one of:

    * Do Not Build
    * Pivot Recommended
    * Proceed With Caution
    * Build MVP
    * Strong Opportunity

    Verdict Guidelines:

    Do Not Build:
    Weak market demand and poor differentiation.

    Pivot Recommended:
    Interesting idea but significant changes required.

    Proceed With Caution:
    Potential exists but substantial risks remain.

    Build MVP:
    Strong validation and reasonable market opportunity.

    Strong Opportunity:
    Strong validation, strong demand, and clear competitive advantages.

    10. Recommended Next Steps

    Provide practical founder actions for the next stage of validation.

    Important:

    * Do not repeat information excessively.
    * Keep recommendations specific and actionable.
    * Do not invent evidence.
    * Every conclusion must be supported by the provided inputs.

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