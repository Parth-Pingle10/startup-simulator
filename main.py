import time

from fastapi import FastAPI, Request, Depends

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler

from schemas import StartupRequest
from builder import graph
from utils.logger import logger
from auth.routes import router as auth_router
from auth.dependencies import get_current_user
from services.analysis_service import create_analysis, complete_analysis, fail_analysis

limiter = Limiter(
    key_func=get_remote_address
)

app = FastAPI()

app.include_router(
    auth_router
)

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
    startup: StartupRequest,
    current_user = Depends(get_current_user)
):  
    
    logger.info(
        f"New Analysis: {startup.startup_name}"
    )

    try:
        start = time.time()
        
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
        
        analysis_id = await create_analysis(
            current_user["user_id"],
            state
        )

        state["analysis_id"] = analysis_id
        state["user_id"] = current_user["user_id"]

        result = graph.invoke(
            state
        )
        
        runtime = time.time() - start
        
        await complete_analysis(
            analysis_id,
            result,
            runtime
        )
        logger.info(
            f"Analysis Complete: {startup.startup_name}; Total time: {runtime}"
        )
        
        return {
            "success": True,
            "data": result
        }

    except Exception as e:

        if "analysis_id" in locals():

            await fail_analysis(
                analysis_id,
                str(e)
            )

        logger.error(
            f"Analysis Failed: {str(e)}"
        )

        return {
            "success": False,
            "error": str(e)
        }