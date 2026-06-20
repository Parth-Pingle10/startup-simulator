from pydantic import BaseModel

class StartupScore(BaseModel):

    market_fit_score: int

    differentiation_score: int

    problem_strength_score: int

    monetization_score: int

    execution_complexity_score: int

    overall_score: int

    verdict: str