
from agent_llm.agent_2 import agent2_llm

def competitor_finder(state):

    prompt = f"""
    You are a startup market research expert.

    Startup Name:
    {state["startup_name"]}

    Description:
    {state["one_line_description"]}

    Problem:
    {state["problem"]}

    Solution:
    {state["solution"]}

    Target Users:
    {state["target_users"]}

    Key Features:
    {", ".join(state["key_features"])}

    Tasks:

    1. Identify the 5 strongest direct competitors.
    2. Prefer real products and startups.
    3. Competitors should solve the same problem.
    4. Return only competitors that currently exist.

    Return the top 5 competitors.
    """

    response = agent2_llm.invoke(prompt)

    
    if isinstance(response, dict):
        competitors = response["competitors"]
    else:
        competitors = response.competitors

    return {
        "competitors": competitors
    }