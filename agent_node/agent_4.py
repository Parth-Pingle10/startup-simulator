import asyncio

from agent_state.agent_4 import CompetitorAnalysis

from utils.structured_invoke import invoke_structured
from utils.logger import logger
from utils.agent_runner import run_agent


async def competitor_intelligence_agent(state):

    async def analyze_company(company):

        logger.info(
            f"Processing {company['competitor']}"
        )

        # Already researched by Gemini fallback
        if company["source"] == "llm_research":

            return {

                "competitor":
                company["competitor"],

                "strengths":
                company["strengths"],

                "weaknesses":
                company["weaknesses"],

                "pain_points":
                company["pain_points"],

                "feature_requests":
                company["feature_requests"],

                "target_users":
                company["target_users"]

            }

        logger.info(
            f"{company['competitor']} | Gemini Analysis Started"
        )

        prompt = f"""
         You are an expert product researcher and customer insights analyst.

    Analyze the competitor reviews and extract insights ONLY from the provided reviews.

    Competitor:
    {company["competitor"]}

    Reviews:
    {company["reviews"]}

    Tasks:

    1. Identify the most commonly mentioned strengths.
    2. Identify the most commonly mentioned weaknesses.
    3. Extract recurring customer pain points.
    4. Extract feature requests or missing features users repeatedly mention.
    5. Identify the types of users who appear to benefit most from the product.

    Analysis Rules:

    * Base findings ONLY on the provided reviews.
    * Do NOT invent strengths or weaknesses.
    * Do NOT assume features that are not mentioned.
    * If evidence is insufficient, return an empty list.
    * Focus on recurring themes rather than isolated comments.
    * Prioritize complaints and requests that appear multiple times.

    Strengths:

    * What users consistently like.
    * Features or benefits frequently praised.

    Weaknesses:

    * What users consistently dislike.
    * Areas where users report dissatisfaction.

    Pain Points:

    * Frustrations, obstacles, complaints, or unmet needs.
    * Issues causing negative experiences.

    Feature Requests:

    * Missing functionality.
    * Requested improvements.
    * Desired integrations or capabilities.

    Target Users:

    * User groups that appear to receive the most value.
    * Infer only when supported by review evidence.

    Important:

    If a finding is not supported by the reviews, do not include it.

    Return structured output only.
        """

        response = await invoke_structured(

            CompetitorAnalysis,

            prompt

        )

        logger.info(
            f"{company['competitor']} | Gemini Analysis Finished"
        )

        if hasattr(response, "model_dump"):

            return response.model_dump()

        return response


    async def execute():

        logger.info(
            f"Agent 4 Started | {state['startup_name']}"
        )

        tasks = [

            analyze_company(company)

            for company in state["competitor_research"]

        ]

        results = await asyncio.gather(

            *tasks,

            return_exceptions=True

        )

        competitor_insights = []

        for company, result in zip(

            state["competitor_research"],

            results

        ):

            if isinstance(result, Exception):

                logger.exception(

                    f"{company['competitor']} Failed"

                )

                continue

            competitor_insights.append(
                result
            )

        logger.info(
            f"Agent 4 Completed | {state['startup_name']}"
        )

        return {

            "competitor_insights":
            competitor_insights

        }

    return await run_agent(

        state,

        4,

        execute

    )
       