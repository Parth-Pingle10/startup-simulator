from scraper.trustpilot import (
    search_trustpilot,
    scrape_trustpilot_reviews
)

from utils.structured_invoke import invoke_structured

from pydantic import BaseModel
from typing import List


class FallbackResearch(BaseModel):

    strengths: List[str]

    weaknesses: List[str]

    pain_points: List[str]

    feature_requests: List[str]

    target_users: List[str]


def llm_competitor_research(
    competitor
    
):


    prompt = f"""
You are a senior product researcher, startup analyst, and competitive intelligence expert.

Your task is to analyze a competitor product and identify how customers are likely to perceive it.

Competitor:
{competitor}

Objective:

Generate realistic competitor intelligence that can be used for startup validation and market analysis.

Focus on:

- Customer experience
- Product strengths
- Product weaknesses
- Common frustrations
- Missing functionality
- User expectations

Instructions:

1. Think from the perspective of real users.
2. Consider common issues found in SaaS, consumer apps, marketplaces, AI products, and digital products.
3. Avoid marketing language.
4. Avoid generic statements.
5. Focus on actionable product insights.
6. If uncertain, infer the most likely customer concerns based on the competitor's category and positioning.

Strengths:
- Features users are likely to value
- Capabilities that differentiate the product
- Reasons customers choose it

Weaknesses:
- Product limitations
- Areas of dissatisfaction
- Competitive disadvantages

Pain Points:
- Complaints users are likely to have
- Frustrations that reduce satisfaction
- Problems causing churn or abandonment

Feature Requests:
- Missing capabilities users are likely to request
- Frequently desired improvements

Target Users:
- Customer segments most likely to benefit from the product

Important:

Do NOT generate vague outputs such as:

- Good UI
- Better experience
- Easy to use
- AI powered
- Seamless workflow

Generate specific, realistic findings.

Return structured output only.
"""

    response = invoke_structured(
        FallbackResearch,
        prompt
    )

    if hasattr(
        response,
        "model_dump"
    ):
        return response.model_dump()

    return{ "reviews" : response}


def collect_competitor_reviews(
    competitor,
   
):

    search_result = (
        search_trustpilot(
            competitor
        )
    )

    if search_result:

        reviews = (
            scrape_trustpilot_reviews(
                search_result["review_url"]
            )
        )

        if len(reviews) > 0:

            return {
                "competitor":
                competitor,

                "source":
                "trustpilot",

                "review_url":
                search_result["review_url"],

                "review_count":
                len(reviews),

                "reviews":
                reviews
            }

    research = (
        llm_competitor_research(
            competitor
        )
    )

    return {
        "competitor":
        competitor,

        "source":
            
        "llm_research",

        **research
    }