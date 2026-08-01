import uuid

from datetime import datetime, timezone

from backend.database.collections import analysis_collection, logs_collection


async def create_analysis(user_id, state):
    analysis = {
        "analysis_id": str(uuid.uuid4()),
        "user_id": user_id,
        "startup_name": state["startup_name"],
        "problem": state["problem"],
        "solution": state["solution"],
        "target_users": state["target_users"],
        "status": "running",
        "pause_requested": False,
        "last_completed_step": 0,
        "checkpoint": {
            "startup_name": state["startup_name"],
            "problem": state["problem"],
            "solution": state["solution"],
            "target_users": state["target_users"],
        },
        "created_at": datetime.now(timezone.utc),
        "completed_at": None,
        "total_runtime": None,
        "report": None,
    }

    await analysis_collection.insert_one(analysis)
    return analysis["analysis_id"]


async def complete_analysis(analysis_id, report, runtime):
    await analysis_collection.update_one(
        {"analysis_id": analysis_id},
        {
            "$set": {
                "status": "completed",
                "pause_requested": False,
                "completed_at": datetime.now(timezone.utc),
                "total_runtime": runtime,
                "report": report,
                "checkpoint": report,
                "last_completed_step": 10,
            }
        },
    )


async def fail_analysis(analysis_id, error):
    await analysis_collection.update_one(
        {"analysis_id": analysis_id},
        {
            "$set": {
                "status": "failed",
                "pause_requested": False,
                "completed_at": datetime.now(timezone.utc),
            },
            "$push": {"logs.errors": error},
        },
    )


async def request_pause(analysis_id: str, user_id: str) -> bool:
    result = await analysis_collection.update_one(
        {
            "analysis_id": analysis_id,
            "user_id": user_id,
            "status": "running",
        },
        {"$set": {"pause_requested": True}},
    )
    return result.modified_count > 0 or result.matched_count > 0


async def is_pause_requested(analysis_id: str) -> bool:
    doc = await analysis_collection.find_one(
        {"analysis_id": analysis_id},
        {"pause_requested": 1, "status": 1},
    )
    if not doc:
        return False
    return bool(doc.get("pause_requested")) or doc.get("status") == "paused"


async def mark_paused(analysis_id: str, current_agent: str | None = None):
    await analysis_collection.update_one(
        {"analysis_id": analysis_id},
        {
            "$set": {
                "status": "paused",
                "pause_requested": False,
            }
        },
    )
    update: dict = {"status": "paused"}
    if current_agent is not None:
        update["current_agent"] = current_agent
    await logs_collection.update_one(
        {"analysis_id": analysis_id},
        {"$set": update},
    )


async def mark_running(analysis_id: str):
    await analysis_collection.update_one(
        {"analysis_id": analysis_id},
        {
            "$set": {
                "status": "running",
                "pause_requested": False,
            }
        },
    )
    await logs_collection.update_one(
        {"analysis_id": analysis_id},
        {"$set": {"status": "running"}},
    )


async def save_checkpoint(analysis_id: str, patch: dict, last_completed_step: int):
    doc = await analysis_collection.find_one(
        {"analysis_id": analysis_id},
        {"checkpoint": 1},
    )
    checkpoint = dict(doc.get("checkpoint") or {}) if doc else {}
    checkpoint.update(patch or {})
    await analysis_collection.update_one(
        {"analysis_id": analysis_id},
        {
            "$set": {
                "checkpoint": checkpoint,
                "last_completed_step": last_completed_step,
            }
        },
    )


async def get_analysis_doc(analysis_id: str, user_id: str | None = None):
    query: dict = {"analysis_id": analysis_id}
    if user_id:
        query["user_id"] = user_id
    return await analysis_collection.find_one(query, {"_id": 0})
