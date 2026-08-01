from pydantic import BaseModel

class StartupScore(BaseModel):

    market_fit_score: int

    market_fit_reason: str

    differentiation_score: int

    differentiation_reason: str

    problem_strength_score: int

    problem_strength_reason: str

    monetization_score: int

    monetization_reason: str

    execution_complexity_score: int

    execution_complexity_reason: str

    overall_score: int

    verdict: str
