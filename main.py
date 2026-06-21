from schemas import StartupRequest
from builder import graph
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def home():

    return {
        "message":
        "Startup Simulator API Running"
    }
    
@app.post("/analyze")
async def analyze_startup(
    request: StartupRequest
):

    try:

        state = {
            "startup_name":
            request.startup_name,

            "problem":
            request.problem,

            "solution":
            request.solution,

            "target_users":
            request.target_users
        }

        result = graph.invoke(
            state
        )

        return {
            "success": True,
            "data": result
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }