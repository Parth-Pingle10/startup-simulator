import uuid

from datetime import (
    datetime,
    timezone
)

from database.collections import (
    analysis_collection
)


async def create_analysis(
    user_id,
    state

):

    analysis = {

        "analysis_id": str(
            uuid.uuid4()
        ),

        "user_id": user_id,

        "startup_name": state["startup_name"],

        "problem": state["problem"],

        "solution": state["solution"],

        "target_users": state["target_users"],

        "status": "running",

        "created_at": datetime.now(
            timezone.utc
        ),

        "completed_at": None,

        "total_runtime": None,

        "report": None,


    }

    await analysis_collection.insert_one(
        analysis
    )

    return analysis["analysis_id"]

async def complete_analysis(

    analysis_id,

    report,

    runtime

):

    await analysis_collection.update_one(

        {

            "analysis_id":
            analysis_id

        },

        {

            "$set": {

                "status":
                "completed",

                "completed_at":
                datetime.now(
                    timezone.utc
                ),

                "total_runtime":
                runtime,

                "report":
                report

            }

        }

    )
    
    
async def fail_analysis(

    analysis_id,

    error

):

    await analysis_collection.update_one(

        {

            "analysis_id":
            analysis_id

        },

        {

            "$set": {

                "status":
                "failed",

                "completed_at":
                datetime.now(
                    timezone.utc
                )

            },

            "$push": {

                "logs.errors":

                error

            }

        }

    )