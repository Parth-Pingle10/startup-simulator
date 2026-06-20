from config import llm
from utils.competitor_research import collect_competitor_reviews

def competitor_research_agent(
    state
):

    results = []

    for competitor in (
        state["competitors"]
    ):

        result = (
            collect_competitor_reviews(
                competitor,
                llm
            )
        )

        results.append(
            result
        )

    return {
        "competitor_research":
        results
    }