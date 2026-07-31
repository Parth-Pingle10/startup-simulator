from typing import List, Literal
from pydantic import BaseModel


class PersonaFeedback(BaseModel):

    persona_name: str

    would_use: Literal["Yes", "Maybe", "No"]

    adoption_score: int

    would_pay: Literal["Yes", "Maybe", "No"]

    would_recommend: Literal["Yes", "Maybe", "No"]

    liked_features: List[str]

    concerns: List[str]

    missing_features: List[str]

    adoption_reason: str

    deal_breaker: str

    purchase_decision: Literal[
        "Buy Immediately",
        "Try Free Version",
        "Wait For Improvements",
        "Compare With Competitors",
        "Not Interested"
    ]

    preferred_competitor: str

    competitor_reason: str

    customer_review: str


class PersonaFeedbackOutput(BaseModel):

    persona_feedback: List[PersonaFeedback]