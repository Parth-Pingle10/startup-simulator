import time

from backend.constants.agents import AGENTS
from backend.services.analysis_service import (
    is_pause_requested,
    mark_paused,
    save_checkpoint,
)
from backend.services.log_service import append_agent_log, update_progress
from backend.utils.exceptions import AnalysisPaused


async def run_agent(state, step: int, function):
    analysis_id = state["analysis_id"]
    start = time.time()
    agent = AGENTS[step]

    # Stop before doing work if pause was requested
    if await is_pause_requested(analysis_id):
        await mark_paused(analysis_id, current_agent=agent["name"])
        raise AnalysisPaused(f"Paused before {agent['name']}")

    # While this agent runs, progress reflects only completed agents
    await update_progress(
        analysis_id=analysis_id,
        progress=(step - 1) * 10,
        current_agent=agent["name"],
    )

    try:
        result = await function()

        # If the user left mid-agent, discard the result — do not write agent output
        if await is_pause_requested(analysis_id):
            await mark_paused(analysis_id, current_agent=agent["name"])
            raise AnalysisPaused(f"Paused during {agent['name']} — result discarded")

        runtime = time.time() - start

        await append_agent_log(
            analysis_id=analysis_id,
            step=step,
            agent_name=agent["name"],
            runtime=runtime,
            status="success",
        )

        await update_progress(
            analysis_id=analysis_id,
            progress=step * 10,
            current_agent=agent["name"],
        )

        await save_checkpoint(
            analysis_id=analysis_id,
            patch=result or {},
            last_completed_step=step,
        )

        return result

    except AnalysisPaused:
        raise
    except Exception as e:
        runtime = time.time() - start
        await append_agent_log(
            analysis_id=analysis_id,
            step=step,
            agent_name=agent["name"],
            runtime=runtime,
            status="failed",
            error=str(e),
        )
        raise
