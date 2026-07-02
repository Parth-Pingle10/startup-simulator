from fastapi import APIRouter, Depends, HTTPException

from auth.dependencies import get_current_user
from database.collections import analysis_collection
from database.collections import logs_collection

router = APIRouter(
    prefix="/logs",
    tags=["Logs"]
)


@router.get("/{analysis_id}/logs")
async def get_logs(
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

    logs = await logs_collection.find_one(
        {
            "analysis_id": analysis_id
        },
        {
            "_id":0
        }
    )

    return logs
