import os
import time
import asyncio
import sys

from fastapi import FastAPI, Request, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler

from backend.schemas import StartupRequest
from backend.services.pipeline import run_analysis_task
from backend.utils.logger import logger
from backend.auth.dependencies import get_current_user
from backend.services.analysis_service import create_analysis
from backend.services.log_service import create_log

from backend.routes.auth import router as auth_router
from backend.routes.analysis import router as analysis_router
from backend.routes.logs import router as logs_router

if sys.platform == "win32":
    asyncio.set_event_loop_policy(
        asyncio.WindowsProactorEventLoopPolicy()
    )

limiter = Limiter(
    key_func=get_remote_address
)

app = FastAPI()

origins = [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173,http://127.0.0.1:3000").split(",") if origin.strip()]

print("CORS Origins:", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_private_network=True,
)

app.include_router(auth_router)
app.include_router(logs_router)
app.include_router(analysis_router)

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
    background_tasks: BackgroundTasks,
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

        await create_log(
            analysis_id,
            current_user["user_id"]
        )
        
        state["analysis_id"] = analysis_id
        state["user_id"] = current_user["user_id"]

        background_tasks.add_task(run_analysis_task, state, analysis_id, start, 1)
        
        return {
            "success": True,
            "analysis_id": analysis_id,
            "message": "Analysis started."
        }

    except Exception as e:
        logger.error(
            f"Analysis Failed to Start: {str(e)}"
        )

        return {
            "success": False,
            "error": str(e)
        }
