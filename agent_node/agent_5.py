from agent_llm.agent_5 import agent5_llm

def market_gap_analysis_agent(state):

    prompt = f"""
    You are an expert startup strategist, product manager, and market analyst.

Your task is to evaluate the startup against existing competitors and identify genuine market opportunities.

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

Analysis Tasks:

1. Identify startup strengths compared to competitors.
2. Identify competitor pain points that the startup already solves.
3. Identify competitor pain points that the startup does NOT solve.
4. Identify market opportunities.
5. Identify competitive threats.
6. Estimate market fit score from 0-100.

Analysis Rules:

* Base all conclusions on the provided competitor intelligence.
* Do NOT invent competitor weaknesses.
* Do NOT invent opportunities without supporting evidence.
* Use recurring competitor pain points when identifying opportunities.
* Use competitor strengths when identifying threats.
* Focus on practical product insights rather than business buzzwords.

Startup Strengths:

* Features or capabilities where the startup appears stronger than competitors.
* Must be supported by the provided data.

Solved Pain Points:

* Customer frustrations already addressed by the startup's features.
* Must directly map to identified competitor pain points.

Unsolved Pain Points:

* Customer frustrations not addressed by the startup.
* Represent missing functionality or future roadmap opportunities.

Opportunities:

* Market gaps revealed by competitor weaknesses.
* Repeated user complaints.
* Frequently requested features.
* Underserved customer needs.

Threats:

* Strong competitor advantages.
* Established competitors with better offerings.
* Features competitors already execute exceptionally well.

Market Fit Score Guidelines:

0-20:
Little evidence of market demand.

21-40:
Weak market fit.

41-60:
Moderate market fit.

61-80:
Strong market fit.

81-100:
Exceptional market fit.

Scoring Criteria:

* Problem importance.
* Strength of solution.
* Coverage of customer pain points.
* Differentiation from competitors.
* Feature completeness.
* Alignment with target users.

Important:

Every strength, opportunity, threat, solved pain point, and unsolved pain point must be traceable to the provided competitor intelligence.

Return structured output only.
    """

    response = agent5_llm.invoke(prompt)

    if isinstance(response, dict):

        analysis = response

    else:

        analysis = response.model_dump()

    return {
        "market_gaps": analysis
    }