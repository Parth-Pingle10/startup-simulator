import time

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException

from backend.auth.dependencies import get_current_user
from backend.database.collections import analysis_collection
from backend.database.collections import logs_collection
from backend.services.analysis_service import get_analysis_doc, request_pause
from backend.services.pipeline import run_analysis_task


router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)

@router.get("")
async def get_all_analysis(
    current_user=Depends(
        get_current_user
    )
):

    cursor = analysis_collection.find(
        {
            "user_id":
            current_user["user_id"]
        },
        {
            "_id": 0,
            "analysis_id": 1,
            "startup_name": 1,
            "status": 1,
            "created_at": 1,
            "completed_at": 1,
            "total_runtime": 1,
            "last_completed_step": 1,
        }
    ).sort(
        "created_at",
        -1
    )

    analysis = await cursor.to_list(
        length=None
    )

    return {

        "analysis":
        analysis

    }
    

@router.get("/{analysis_id}")
async def get_analysis(
    analysis_id: str,
    current_user=Depends(
        get_current_user
    )

):

    analysis = await analysis_collection.find_one(
        {
            "analysis_id": analysis_id,
            "user_id": current_user["user_id"]
        },
        {
            "_id": 0
        }
    )
    
    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found."
        )
    return analysis


@router.delete("/{analysis_id}")
async def delete_analysis(
    analysis_id: str,
    current_user=Depends(
        get_current_user
    )
):
    result = await analysis_collection.delete_one(
        {
            "analysis_id": analysis_id,
            "user_id": current_user["user_id"]
        }
    )
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found."
        )

    await logs_collection.delete_one(
        {
            "analysis_id":
            analysis_id
        }
    )

    return {
        "message":
        "Analysis deleted successfully."
    }

@router.get("/{analysis_id}/progress")
async def get_progress(
    analysis_id: str,
    current_user=Depends(
        get_current_user
    )
):
    analysis = await analysis_collection.find_one(
        {
            "analysis_id": analysis_id,
            "user_id": current_user["user_id"]
        }
    )

    if analysis is None:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found."
        )

    log = await logs_collection.find_one(
        {
            "analysis_id": analysis_id
        },
        {
            "_id": 0,
            "status": 1,
            "progress": 1,
            "current_agent": 1,
            "started_at": 1,
            "completed_at": 1,
            "total_runtime": 1
        }
    )

    if log is None:
        raise HTTPException(
            status_code=404,
            detail="Logs not found."
        )

    # Prefer analysis status for paused/running/completed
    if analysis.get("status"):
        log["status"] = analysis["status"]
    log["last_completed_step"] = analysis.get("last_completed_step", 0)
    return log


@router.post("/{analysis_id}/pause")
async def pause_analysis(
    analysis_id: str,
    current_user=Depends(get_current_user),
):
    ok = await request_pause(analysis_id, current_user["user_id"])
    if not ok:
        # Still acknowledge — may already be paused/completed
        doc = await get_analysis_doc(analysis_id, current_user["user_id"])
        if not doc:
            raise HTTPException(status_code=404, detail="Analysis not found.")
    return {"message": "Pause requested.", "analysis_id": analysis_id}


@router.post("/{analysis_id}/resume")
async def resume_analysis(
    analysis_id: str,
    background_tasks: BackgroundTasks,
    current_user=Depends(get_current_user),
):
    doc = await get_analysis_doc(analysis_id, current_user["user_id"])
    if not doc:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    if doc.get("status") == "completed":
        return {"message": "Already completed.", "analysis_id": analysis_id, "status": "completed"}

    if doc.get("status") == "running":
        if doc.get("pause_requested"):
            await analysis_collection.update_one(
                {"analysis_id": analysis_id},
                {"$set": {"pause_requested": False}},
            )
        return {"message": "Already running.", "analysis_id": analysis_id, "status": "running"}


    last_completed = int(doc.get("last_completed_step") or 0)
    start_step = last_completed + 1
    if start_step > 10:
        return {"message": "Already completed.", "analysis_id": analysis_id, "status": "completed"}

    checkpoint = dict(doc.get("checkpoint") or {})
    state = {
        **checkpoint,
        "startup_name": doc.get("startup_name"),
        "problem": doc.get("problem"),
        "solution": doc.get("solution"),
        "target_users": doc.get("target_users"),
        "analysis_id": analysis_id,
        "user_id": current_user["user_id"],
    }

    background_tasks.add_task(run_analysis_task, state, analysis_id, time.time(), start_step)
    return {
        "message": "Analysis resumed.",
        "analysis_id": analysis_id,
        "start_step": start_step,
        "status": "running",
    }
