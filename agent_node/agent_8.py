from agent_llm.agent_8 import agent8_llm

def persona_simulation_agent(state):

    persona_feedback = []

    for persona in state["personas"]:

        prompt = f"""
         You are roleplaying as the following customer persona.

Persona:
{persona}

You MUST think, behave, and make decisions exactly like this persona.

Do NOT act as an analyst.

Do NOT act as a startup advisor.

Do NOT try to help the startup succeed.

Your only goal is to determine whether YOU, as this persona, would actually use this product.

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

Evaluation Instructions:

Analyze the startup from the perspective of the persona only.

Consider:

* Personal goals
* Frustrations
* Budget constraints
* Technical comfort level
* Current alternatives
* Existing habits
* Motivations
* Concerns

Decision Rules:

If the persona is skeptical:

* Be difficult to convince.
* Focus on weaknesses.
* Challenge assumptions.

If the persona is budget-conscious:

* Focus heavily on pricing and value.

If the persona is a power user:

* Compare against existing competitors.
* Demand advanced functionality.

If the persona is a casual user:

* Prioritize simplicity and convenience.

If the persona has low adoption likelihood:

* Default toward rejection unless there is a strong reason to adopt.

Important:

Do NOT automatically approve the startup.

It is acceptable to:

* Reject the startup.
* Refuse to pay.
* Refuse to recommend it.
* Criticize missing features.

Provide:

1. Would you use this startup?
2. Adoption score (0-100)
3. Would you pay for it?
4. Would you recommend it?
5. Favorite feature
6. Most important missing feature
7. Main concerns
8. Detailed feedback written in the first person as the persona

Scoring Guidelines:

0-20:
Would never use.

21-40:
Unlikely to use.

41-60:
Possibly interested.

61-80:
Likely to use.

81-100:
Highly likely to use.

Return structured output only.
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