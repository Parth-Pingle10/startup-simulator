import time

from constants.agents import AGENTS

from services.log_service import (
    update_progress,
    append_agent_log
)


async def run_agent(

    state,

    step: int,

    function

):

    start = time.time()

    agent = AGENTS[step]

    await update_progress(

        analysis_id=state["analysis_id"],

        progress=agent["progress"],

        current_agent=agent["name"]

    )

    try:

        result = await function()

        runtime = time.time() - start

        await append_agent_log(

            analysis_id=state["analysis_id"],

            step=step,

            agent_name=agent["name"],

            runtime=runtime,

            status="success"

        )

        return result

    except Exception as e:

        runtime = time.time() - start

        await append_agent_log(

            analysis_id=state["analysis_id"],

            step=step,

            agent_name=agent["name"],

            runtime=runtime,

            status="failed",

            error=str(e)

        )

        raise