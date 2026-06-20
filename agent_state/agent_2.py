from pydantic import BaseModel
from typing import List,TypedDict

class CompetitorOutput(TypedDict):
    competitors : List[str]