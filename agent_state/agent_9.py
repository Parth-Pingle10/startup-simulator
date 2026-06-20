from pydantic import BaseModel
from typing import List

class AdoptionAnalytics(BaseModel):

    adoption_probability: int

    payment_probability: int

    recommendation_probability: int

    average_adoption_score: int

    most_requested_features: List[str]

    top_concerns: List[str]

    strongest_selling_points: List[str]

    likely_early_adopters: List[str]

    likely_rejectors: List[str]