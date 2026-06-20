from agent_llm.agent_7 import agent7_llm

def persona_generator_agent(state):

    prompt = f"""
    Create 15 realistic customer personas.

    Startup Target Users:
    {state["target_users"]}

    Startup Description:
    {state["one_line_description"]}

    Startup Features:
    {state["key_features"]}

    Market Gap Analysis:
    {state["market_gaps"]}

    Competitor Intelligence:
    {state["competitor_insights"]}

    Startup Score:
    {state["startup_score"]}

    Requirements:

    1. Personas must be realistic.
    2. Use actual frustrations discovered in competitor research.
    3. Use actual target users.
    4. Include supporters, skeptics and non-users.
    5. Generate exactly 15 personas.

    Return structured output.
    """

    response = agent7_llm.invoke(prompt)

    if isinstance(response, dict):

        personas = response["personas"]

    else:

        personas = [
            p.model_dump()
            for p in response.personas
        ]

    return {
        "personas": personas
    }