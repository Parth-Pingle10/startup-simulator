from pydantic import BaseModel
from typing import List

class Persona(BaseModel):

    name: str

    age_range: str

    occupation: str

    goals: List[str]

    frustrations: List[str]

    budget_level: str

    tech_savviness: str

    adoption_likelihood: str


class PersonaOutput(BaseModel):

    personas: List[Persona]