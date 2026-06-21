from fastapi import FastAPI, Request

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler

from schemas import StartupRequest
from builder import graph


limiter = Limiter(
    key_func=get_remote_address
)

app = FastAPI()

app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
)

app.add_middleware(
    SlowAPIMiddleware
)


@app.get("/")
@limiter.limit("30/minute")
def home(request: Request):

    return {
        "message":
        "Startup Simulator API Running"
    }


@app.post("/analyze")
@limiter.limit("5/hour")
async def analyze_startup(
    request: Request,
    startup: StartupRequest
):

    try:

        state = {
            "startup_name":
            startup.startup_name,

            "problem":
            startup.problem,

            "solution":
            startup.solution,

            "target_users":
            startup.target_users
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