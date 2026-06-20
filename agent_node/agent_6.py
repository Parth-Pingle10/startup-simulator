from agent_llm.agent_6 import agent6_llm

def startup_scoring_agent(state):

    prompt = f"""
    Evaluate this startup.

    Startup Description:
    {state["one_line_description"]}

    Features:
    {state["key_features"]}

    Market Gap Analysis:
    {state["market_gaps"]}

    Competitor Intelligence:
    {state["competitor_insights"]}

    Score the startup.

    Provide:

    1. Market Fit Score (0-100)
    2. Differentiation Score (0-100)
    3. Problem Strength Score (0-100)
    4. Monetization Score (0-100)
    5. Execution Complexity Score (0-100)
    6. Overall Score (0-100)

    Verdict:

    - Poor
    - Average
    - Good
    - Excellent

    Return structured output.
    """

    response = agent6_llm.invoke(prompt)

    if isinstance(response, dict):

        result = response

    else:

        result = response.model_dump()

    return {
        "startup_score": result
    }