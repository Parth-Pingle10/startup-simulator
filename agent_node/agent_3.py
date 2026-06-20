from config import llm

from utils.competitor_research import (
    collect_competitor_reviews
)


def competitor_research_agent(
    state
):

    competitor_research = []

    for competitor in (
        state["competitors"]
    ):

        try:

            result = (
                collect_competitor_reviews(
                    competitor,
                    llm
                )
            )

            competitor_research.append(
                result
            )

        except Exception as e:

            competitor_research.append(
                {
                    "competitor":
                    competitor,

                    "source":
                    "error",

                    "error":
                    str(e)
                }
            )

    return {
        "competitor_research":
        competitor_research
    }