from agent_llm.agent_1 import agent1_llm

def startup_analyzer(state):

    prompt1 = f"""
    You are an expert startup analyst.

    Analyze the startup information below.

    Startup Name:
    {state["startup_name"]}

    Problem:
    {state["problem"]}

    Solution:
    {state["solution"]}

    Target Users:
    {state["target_users"]}

    Tasks:

    1. Create a clear one-line startup description.
    2. Generate 5-10 realistic key features.
    3. Features must directly support the solution and target users.
    4. Do not generate generic startup buzzwords.

    Return structured output.
    """

    response = agent1_llm.invoke(prompt1)

    return {
        "one_line_description": response.one_line_description,
        "key_features": response.key_features
    }