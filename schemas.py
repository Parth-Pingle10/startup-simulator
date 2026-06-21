from pydantic import BaseModel


class StartupRequest(BaseModel):

    startup_name: str

    problem: str

    solution: str

    target_users: str