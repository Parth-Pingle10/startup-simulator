from backend.agent_state.agent_6 import StartupScore
from backend.utils.structured_invoke import invoke_structured
from backend.utils.logger import logger
from backend.utils.agent_runner import run_agent
import time

async def startup_scoring_agent(state):
        
    async def  execute():
            
        logger.info(
            f"Agent 6 Started | {state['startup_name']}"
        )

        prompt = f"""
        You are an experienced startup investor, venture capitalist, product strategist, and market analyst.

    Your task is to objectively evaluate the startup using the provided market research.

    Startup Description:
    {state["one_line_description"]}

    Startup Features:
    {state["key_features"]}

    Market Gap Analysis:
    {state["market_gaps"]}

    Competitor Intelligence:
    {state["competitor_insights"]}

    Evaluate the startup across multiple dimensions.

    Evaluation Rules:

    * Be objective and evidence-based.
    * Do not assume the startup will succeed.
    * Do not assume the startup will fail.
    * Base all judgments on the provided information.
    * Compare the startup against existing competitors.
    * Consider both strengths and weaknesses.
    * High scores must be justified by strong evidence.
    * Low scores must be justified by significant weaknesses.
    * Use the full scoring range from 0 to 100 when appropriate.
    * Do not artificially inflate or compress scores.
    * Do not favor startups simply because they use AI.

    Scoring Categories:

    1. Market Fit Score (0-100)

    Evaluate:

    * Demand for the problem
    * Alignment with customer needs
    * Coverage of customer pain points
    * Relevance to target users

    2. Differentiation Score (0-100)

    Evaluate:

    * Competitive advantage
    * Uniqueness
    * Defensibility
    * Novel value proposition

    3. Problem Strength Score (0-100)

    Evaluate:

    * Severity of the problem
    * Frequency of occurrence
    * Importance to users
    * Urgency of solving it

    4. Monetization Score (0-100)

    Evaluate:

    * Likelihood customers would pay
    * Revenue potential
    * Pricing feasibility
    * Commercial viability

    5. Execution Complexity Score (0-100)

    Important:

    A higher score means the startup is MORE difficult to build, scale, and operate.

    Evaluate:

    * Technical complexity
    * Data requirements
    * Infrastructure requirements
    * Operational complexity
    * Regulatory complexity

    Reasoning Requirements:

    For each score provide concise reasoning based on the available evidence.

    Do not invent evidence.

    Verdict Rules:

    Poor:
    Startup has major weaknesses, weak market demand, or poor differentiation.

    Average:
    Startup solves a real problem but lacks strong differentiation or competitive advantages.

    Good:
    Startup demonstrates strong demand, reasonable differentiation, and meaningful customer value.

    Excellent:
    Startup demonstrates exceptional market demand, strong competitive advantages, meaningful differentiation, and clear customer value.

    Important:

    Exceptional scores should only be awarded when there is strong evidence supporting them.

    Return structured output only.
        """

        response =await invoke_structured(
        StartupScore,
        prompt
    )

        if isinstance(response, dict):

            result = response

        else:

            result = response.model_dump()
            

        logger.info(
            f"Agent 6 Completed | {state['startup_name']}"
        )

        return {
            "startup_score": result
        }
        
    return await run_agent(
        state,
        6,
        execute
    )