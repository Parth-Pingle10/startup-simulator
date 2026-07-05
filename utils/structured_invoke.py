import logging
import time

from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    before_sleep_log
)

from config.llm_manager import (
    llm_manager
)

from utils.logger import (
    logger
)


@retry(
    stop=stop_after_attempt(3),

    wait=wait_exponential(
        multiplier=1,
        min=2,
        max=10
    ),

    before_sleep=before_sleep_log(
        logger,
        logging.WARNING
    ),

    reraise=True
)
async def invoke_structured(
    schema,
    prompt
):

    logger.info(
        f"Invoking Gemini | {schema.__name__}"
    )

    try:

        llm = (
            llm_manager.primary
            .with_structured_output(
                schema
            )
        )
        start = time.time()


        response = await llm.ainvoke(
            prompt
        )

        logger.info(
    f"{schema.__name__} inference: {time.time()-start:.2f}s"
)

        logger.info(
            f"Gemini Success | {schema.__name__}"
        )

        return response

    except Exception as e:

        logger.warning(
            f"Gemini Failed | {str(e)}"
        )

        logger.info(
            f"Switching To DeepSeek | {schema.__name__}"
        )

        llm = (
            llm_manager.fallback
            .with_structured_output(
                schema
            )
        )

        response = llm.ainvoke(
            prompt
        )

        logger.info(
            f"DeepSeek Success | {schema.__name__}"
        )

        return response