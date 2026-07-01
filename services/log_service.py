from datetime import (
    datetime,
    timezone
)

from database.collections import (
    logs_collection
)


async def create_log(

    analysis_id: str,

    user_id: str

):

    document = {

        "analysis_id":
        analysis_id,

        "user_id":
        user_id,

        "status":
        "running",

        "progress":
        0,

        "current_agent":
        "Initializing",

        "started_at":
        datetime.now(
            timezone.utc
        ),

        "completed_at":
        None,

        "total_runtime":
        None,

        "agent_logs":
        []

    }

    await logs_collection.insert_one(
        document
    )


async def update_progress(

    analysis_id: str,

    progress: int,

    current_agent: str

):

    await logs_collection.update_one(

        {

            "analysis_id":
            analysis_id

        },

        {

            "$set": {

                "progress":
                progress,

                "current_agent":
                current_agent

            }

        }

    )


async def append_agent_log(

    analysis_id: str,

    step: int,

    agent_name: str,

    runtime: float,

    status: str,

    error: str | None = None

):

    await logs_collection.update_one(

        {

            "analysis_id":
            analysis_id

        },

        {

            "$push": {

                "agent_logs": {

                    "step":
                    step,

                    "agent":
                    agent_name,

                    "runtime":
                    round(runtime,2),

                    "status":
                    status,

                    "timestamp":
                    datetime.now(
                        timezone.utc
                    ),

                    "error":
                    error

                }

            }

        }

    )


async def complete_log(

    analysis_id: str,

    runtime: float

):

    await logs_collection.update_one(

        {

            "analysis_id":
            analysis_id

        },

        {

            "$set": {

                "status":
                "completed",

                "progress":
                100,

                "current_agent":
                None,

                "completed_at":
                datetime.now(
                    timezone.utc
                ),

                "total_runtime":
                round(runtime,2)

            }

        }

    )


async def fail_log(

    analysis_id: str,

    runtime: float

):

    await logs_collection.update_one(

        {

            "analysis_id":
            analysis_id

        },

        {

            "$set": {

                "status":
                "failed",

                "current_agent":
                None,

                "completed_at":
                datetime.now(
                    timezone.utc
                ),

                "total_runtime":
                round(runtime,2)

            }

        }

    )


async def get_log(

    analysis_id: str

):

    return await logs_collection.find_one(

        {

            "analysis_id":
            analysis_id

        },

        {

            "_id":
            0

        }

    )