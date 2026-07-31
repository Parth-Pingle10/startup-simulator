from pydantic import BaseModel
from typing import List

class AdoptionAnalytics(BaseModel):

    adoption_probability: int

    payment_probability: int

    recommendation_probability: int

    average_adoption_score: int

    most_liked_features: List[str]

    most_requested_features: List[str]

    top_concerns: List[str]

    biggest_adoption_barriers: List[str]

    preferred_competitors: List[str]

    competitor_advantages: List[str]

    likely_early_adopters: List[str]

    undecided_personas: List[str]

    likely_rejectors: List[str]

    product_improvement_priorities: List[str]