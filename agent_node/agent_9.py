from agent_llm.agent_9 import agent9_llm

def adoption_analytics_agent(state):

    prompt = f"""
    Analyze persona feedback.

    Persona Feedback:
    {state["persona_feedback"]}

    Tasks:

    1. Estimate adoption probability.
    2. Estimate payment probability.
    3. Estimate recommendation probability.
    4. Calculate average adoption score.
    5. Identify most requested features.
    6. Identify top concerns.
    7. Identify strongest selling points.
    8. Identify likely early adopters.
    9. Identify likely rejectors.

    Return structured output.
    """

    response = agent9_llm.invoke(prompt)

    if isinstance(response, dict):

        analytics = response

    else:

        analytics = response.model_dump()

    return {
        "adoption_analytics": analytics
    }