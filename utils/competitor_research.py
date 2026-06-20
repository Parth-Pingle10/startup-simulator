from scraper.trustpilot import (
    search_trustpilot,
    scrape_trustpilot_reviews
)

from utils.company_matcher import (
    is_matching_company
)


def collect_competitor_reviews(
    competitor,
    llm
):

    search_result = (
        search_trustpilot(
            competitor
        )
    )

    if search_result is None:

        return {
            "competitor":
            competitor,

            "matched":
            False,

            "source":
            "not_found",

            "reviews":
            []
        }

    matched = (
        is_matching_company(
            llm,
            competitor,
            search_result["name"]
        )
    )

    if not matched:

        return {
            "competitor":
            competitor,

            "matched":
            False,

            "source":
            "mismatch",

            "reviews":
            []
        }

    reviews = (
        scrape_trustpilot_reviews(
            search_result["review_url"]
        )
    )

    return {
        "competitor":
        competitor,

        "matched":
        True,

        "source":
        "trustpilot",

        "review_url":
        search_result["review_url"],

        "reviews":
        reviews
    }