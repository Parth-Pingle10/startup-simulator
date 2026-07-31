from pydantic import BaseModel 
from typing import List

class FinalReport(BaseModel):

    executive_summary: str

    startup_overview: str

    strengths: List[str]

    weaknesses: List[str]

    opportunities: List[str]

    threats: List[str]

    key_recommendations: List[str]

    final_verdict: str

    next_steps: List[str]