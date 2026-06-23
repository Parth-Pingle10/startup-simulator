from concurrent.futures import (
    ThreadPoolExecutor
)

from config import llm
from utils.logger import logger
from utils.competitor_research import (
    collect_competitor_reviews
)

import time


def process_competitor(
    competitor
):

    try:

        return (
            collect_competitor_reviews(
                competitor,
                llm
            )
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


def competitor_research_agent(
    state
):

    start = time.time()

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

    end = time.time()

    logger.info(
        f"Agent 3 Completed | {state['startup_name']}"
    )

    logger.info(
        f"Agent 3 Runtime: {end-start:.2f}s"
    )

    return {
        "competitor_research":
        competitor_research
    }