from agent_llm.agent_8 import agent8_llm

def persona_simulation_agent(state):

    persona_feedback = []

    for persona in state["personas"]:

        prompt = f"""
        You are the following person:

        {persona}

        Evaluate this startup.

        Startup:
        {state["startup_name"]}

        Description:
        {state["one_line_description"]}

        Features:
        {state["key_features"]}

        Startup Score:
        {state["startup_score"]}

        Market Gaps:
        {state["market_gaps"]}

        Answer as the persona.

        Determine:

        1. Would you use it?
        2. Adoption score (0-100)
        3. Would you pay?
        4. Would you recommend it?
        5. Favorite feature
        6. Missing feature
        7. Concerns
        8. Detailed feedback

        Return structured output.
        """

        response = agent8_llm.invoke(prompt)

        if isinstance(response, dict):

            persona_feedback.append(response)

        else:

            persona_feedback.append(
                response.model_dump()
            )

    return {
        "persona_feedback":
        persona_feedback
    }