from pydantic import BaseModel
from typing import List


class StartupRecommendations(BaseModel):

    strategic_recommendations: List[str]

    product_improvements: List[str]

    mvp_features: List[str]

    future_features: List[str]

    pricing_strategy: List[str]

    go_to_market_strategy: List[str]

    marketing_strategy: List[str]

    launch_strategy: List[str]

    investment_readiness: str

    next_steps: List[str]