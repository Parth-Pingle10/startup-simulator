from agent_llm.agent_5 import agent5_llm

def market_gap_analysis_agent(state):

    prompt = f"""
    Analyze this startup against the market.

    Startup Problem:
    {state["problem"]}

    Startup Solution:
    {state["solution"]}

    Target Users:
    {state["target_users"]}

    Startup Features:
    {state["key_features"]}

    Competitor Intelligence:
    {state["competitor_insights"]}

    Tasks:

    1. Find startup strengths.
    2. Find pain points solved by startup.
    3. Find pain points NOT solved.
    4. Identify opportunities.
    5. Identify threats.
    6. Give market fit score from 0-100.

    Return structured output.
    """

    response = agent5_llm.invoke(prompt)

    if isinstance(response, dict):

        analysis = response

    else:

        analysis = response.model_dump()

    return {
        "market_gaps": analysis
    }