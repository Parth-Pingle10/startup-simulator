from agent_llm.agent_4 import agent4_llm

def competitor_intelligence_agent(state):

    competitor_insights = []

    for company in state["competitor_research"]:

        prompt = f"""
        Analyze the competitor reviews.

        Competitor:
        {company["competitor"]}

        Reviews:
        {company["reviews"]}

        Tasks:

        1. Identify strengths.
        2. Identify weaknesses.
        3. Extract user pain points.
        4. Extract feature requests.
        5. Identify target users.

        Return structured output.
        """

        response = agent4_llm.invoke(prompt)

        if isinstance(response, dict):

            competitor_insights.append(
                response
            )

        else:

            competitor_insights.append(
                response.model_dump()
            )

    return {
        "competitor_insights":
        competitor_insights
    }