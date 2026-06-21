from config.llm_manager import llm_manager

def invoke_structured(
    schema,
    prompt
):

    try:

        llm = (
            llm_manager.primary
            .with_structured_output(
                schema
            )
        )

        return llm.invoke(
            prompt
        )

    except Exception:

        llm = (
            llm_manager.fallback
            .with_structured_output(
                schema
            )
        )

        return llm.invoke(
            prompt
        )