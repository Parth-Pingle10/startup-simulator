from concurrent.futures import (
    ThreadPoolExecutor
)

from utils.logger import logger
from utils.competitor_research import (
    collect_competitor_reviews
)
from utils.agent_runner import run_agent


def process_competitor(
    competitor
):

    try:

        return collect_competitor_reviews(
            competitor
        )

    except Exception as e:

        return {

            "competitor":
            competitor,

            "source":
            "error",

            "error":
            str(e)

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

        with ThreadPoolExecutor(
            max_workers=5
        ) as executor:

            competitor_research = list(

                executor.map(

                    process_competitor,

                    competitors

                )

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