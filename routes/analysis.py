from fastapi import APIRouter, Depends, HTTPException

from auth.dependencies import get_current_user
from database.collections import analysis_collection
from database.collections import logs_collection


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
            "total_runtime": 1
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

    return log