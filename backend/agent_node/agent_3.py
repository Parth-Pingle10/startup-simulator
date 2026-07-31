import asyncio
import traceback

from backend.utils.logger import logger
from backend.utils.competitor_research import (
    collect_competitor_reviews
)
from backend.utils.agent_runner import run_agent


async def process_competitor(
    competitor
):

    try:

        return await collect_competitor_reviews(
            competitor
        )

    except Exception as e:
        traceback.print_exc()

        return {
            "competitor": competitor,
            "source": "error",
            "error": repr(e)
        }


async def competitor_research_agent(
    state
):

    async def execute():

        logger.info(
            f"Agent 3 Started | {state['startup_name']}"
        )

        competitors = (
            state["competitors"]
        )

        competitor_research = await asyncio.gather(

            *[
                process_competitor(
                    competitor
                )
                for competitor in competitors
            ]

        )

        logger.info(
            f"Agent 3 Completed | {state['startup_name']}"
        )

        return {

            "competitor_research":
            competitor_research

        }

    return await run_agent(

        state,

        3,

        execute

    )