import time

from backend.agent_node.agent_1 import startup_analyzer
from backend.agent_node.agent_2 import competitor_finder
from backend.agent_node.agent_3 import competitor_research_agent
from backend.agent_node.agent_4 import competitor_intelligence_agent
from backend.agent_node.agent_5 import market_gap_analysis_agent
from backend.agent_node.agent_6 import startup_scoring_agent
from backend.agent_node.agent_7 import persona_generator_agent
from backend.agent_node.agent_8 import persona_simulation_agent
from backend.agent_node.agent_9 import adoption_analytics_agent
from backend.agent_node.agent_10 import final_report_generator_agent
from backend.services.analysis_service import complete_analysis, fail_analysis, mark_running
from backend.services.log_service import complete_log, fail_log
from backend.utils.exceptions import AnalysisPaused
from backend.utils.logger import logger

PIPELINE_STEPS = [
    (1, startup_analyzer),
    (2, competitor_finder),
    (3, competitor_research_agent),
    (4, competitor_intelligence_agent),
    (5, market_gap_analysis_agent),
    (6, startup_scoring_agent),
    (7, persona_generator_agent),
    (8, persona_simulation_agent),
    (9, adoption_analytics_agent),
    (10, final_report_generator_agent),
]


async def run_pipeline(state: dict, start_step: int = 1) -> dict:
    """Run agents sequentially from start_step (1-10). Supports pause between/during agents."""
    current = dict(state)

    for step, fn in PIPELINE_STEPS:
        if step < start_step:
            continue
        patch = await fn(current)
        if isinstance(patch, dict):
            current.update(patch)

    return current


async def run_analysis_task(state, analysis_id, start_time, start_step: int = 1):
    try:
        await mark_running(analysis_id)
        result = await run_pipeline(state, start_step=start_step)
        runtime = time.time() - start_time

        await complete_analysis(analysis_id, result, runtime)
        await complete_log(analysis_id, runtime)

        logger.info(
            f"Analysis Complete: {state.get('startup_name')}; Total time: {runtime}"
        )
    except AnalysisPaused:
        logger.info(f"Analysis paused: {analysis_id}")
        return
    except Exception as e:
        runtime = time.time() - start_time
        await fail_analysis(analysis_id, str(e))
        await fail_log(analysis_id, runtime)
        logger.error(f"Analysis Failed: {str(e)}")
