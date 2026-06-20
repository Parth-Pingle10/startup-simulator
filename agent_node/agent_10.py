from agent_llm.agent_10 import agent10_llm
    
def final_report_generator_agent(state):

    prompt = f"""
    Create a professional startup validation report.

    Startup Name:
    {state["startup_name"]}

    Description:
    {state["one_line_description"]}

    Features:
    {state["key_features"]}

    Competitors:
    {state["competitors"]}

    Competitor Insights:
    {state["competitor_insights"]}

    Market Gap Analysis:
    {state["market_gaps"]}

    Startup Score:
    {state["startup_score"]}

    Adoption Analytics:
    {state["adoption_analytics"]}

    Persona Feedback:
    {state["persona_feedback"]}

    Create:

    1. Executive Summary
    2. Startup Overview
    3. Strengths
    4. Weaknesses
    5. Opportunities
    6. Threats
    7. Key Recommendations
    8. Final Verdict
    9. Next Steps

    Return structured output.
    """

    response = agent10_llm.invoke(prompt)

    if isinstance(response, dict):

        report = response

    else:

        report = response.model_dump()

    return {
        "final_report": report
    }