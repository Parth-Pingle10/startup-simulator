from pydantic import BaseModel
from typing import List


class StartupValidationReport(BaseModel):

    executive_summary: str

    startup_overview: str

    market_validation: str

    customer_validation: str

    startup_strengths: List[str]

    startup_weaknesses: List[str]

    market_opportunities: List[str]

    market_threats: List[str]

    adoption_probability: int

    payment_probability: int

    recommendation_probability: int

    average_adoption_score: int

    most_liked_features: List[str]

    most_requested_features: List[str]

    top_customer_concerns: List[str]

    biggest_adoption_barriers: List[str]

    preferred_competitors: List[str]

    likely_early_adopters: List[str]

    undecided_personas: List[str]

    likely_rejectors: List[str]

    final_verdict: str