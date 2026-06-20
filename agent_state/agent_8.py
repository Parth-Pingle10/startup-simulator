from pydantic import BaseModel
from typing import List

class PersonaFeedback(BaseModel):

    persona_name: str

    would_use: bool

    adoption_score: int

    would_pay: bool

    would_recommend: bool

    favorite_feature: str

    missing_feature: str

    concerns: List[str]

    feedback: str