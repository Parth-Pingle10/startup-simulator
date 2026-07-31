
from pydantic import BaseModel
from typing import List
class CompetitorAnalysis(BaseModel):

    competitor: str

    strengths: List[str]

    weaknesses: List[str]

    pain_points: List[str]

    feature_requests: List[str]

    target_users: List[str]