from pydantic import BaseModel
from typing import List

class MarketGapAnalysis(BaseModel):

    startup_strengths: List[str]

    uncovered_pain_points: List[str]

    solved_pain_points: List[str]

    opportunities: List[str]

    threats: List[str]

    market_fit_score: int