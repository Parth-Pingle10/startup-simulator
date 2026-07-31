from pydantic import BaseModel
from typing import List

class StartupAnalysis(BaseModel):
    one_line_description: str
    key_features: List[str]