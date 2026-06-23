from typing import List
from pydantic import BaseModel


class PersonaFeedback(BaseModel):

    persona_name: str

    would_use: bool

    adoption_score: int

    would_pay: bool

    would_recommend: bool

    favorite_feature: str

    missing_feature: str

    concerns: List[str]

    detailed_feedback: str


class PersonaFeedbackOutput(
    BaseModel
):

    persona_feedback: List[
        PersonaFeedback
    ]