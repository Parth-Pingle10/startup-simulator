
from agent_state.agent_2 import CompetitorOutput
from utils.structured_invoke import invoke_structured
from utils.logger import logger
from utils.agent_runner import run_agent
import time

async def competitor_finder(state):

    async def execute():
        
        logger.info(
            f"Agent 2 Started | {state['startup_name']}"
        )
        
        prompt = f"""
        You are an expert market research analyst.

    Your task is to identify direct competitors for a startup based on the problem being solved, target users, and product functionality.

    Startup Name:
    {state["startup_name"]}

    Description:
    {state["one_line_description"]}

    Problem:
    {state["problem"]}

    Solution:
    {state["solution"]}

    Target Users:
    {state["target_users"]}

    Key Features:
    {", ".join(state["key_features"])}

    Instructions:

    1. Understand the core problem being solved.
    2. Understand who the target users are.
    3. Identify products, services, apps, platforms, or startups that solve the same problem for similar users.
    4. Prioritize direct competitors over indirect competitors.
    5. Prefer competitors with similar functionality rather than simply operating in the same industry.
    6. Competitors must be currently active and publicly available.

    Competitor Selection Criteria:

    * Solves the same primary problem.
    * Targets similar users.
    * Offers similar features or workflows.
    * Competes for the same customer attention, time, or money.

    Avoid:

    * Unrelated companies in the same industry.
    * Large companies that only partially overlap.
    * Generic categories.
    * Fictional products.
    * Descriptions.
    * URLs.
    * Explanations.

    Output Rules:

    * Return EXACTLY 5 competitors.
    * Return ONLY the competitor names.
    * Do NOT include descriptions.
    * Do NOT include websites.
    * Do NOT include bullet point explanations.
    * Do NOT include extra text before or after the result.
    * Each competitor name should contain only the product or company name.

    Example Valid Output:

    ["Competitor A", "Competitor B", "Competitor C", "Competitor D", "Competitor E"]

    Return structured output only.
        """

        response = await invoke_structured(
        CompetitorOutput,
        prompt
    )


        
        if isinstance(response, dict):
            competitors = response["competitors"]
        else:
            competitors = response.competitors
        
        

        logger.info(
            f"Agent 2 Completed | {state['startup_name']}"
        )
        
        return {
            "competitors": competitors
        }
    return await run_agent(
        state,
        2,
        execute
    )