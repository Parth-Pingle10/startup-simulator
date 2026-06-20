from agent_llm.agent_4 import agent4_llm

def competitor_intelligence_agent(state):

    competitor_insights = []

    for company in state["competitor_research"]:

        prompt = f"""
       You are an expert product researcher and customer insights analyst.

Analyze the competitor reviews and extract insights ONLY from the provided reviews.

Competitor:
{company["competitor"]}

Reviews:
{company["reviews"]}

Tasks:

1. Identify the most commonly mentioned strengths.
2. Identify the most commonly mentioned weaknesses.
3. Extract recurring customer pain points.
4. Extract feature requests or missing features users repeatedly mention.
5. Identify the types of users who appear to benefit most from the product.

Analysis Rules:

* Base findings ONLY on the provided reviews.
* Do NOT invent strengths or weaknesses.
* Do NOT assume features that are not mentioned.
* If evidence is insufficient, return an empty list.
* Focus on recurring themes rather than isolated comments.
* Prioritize complaints and requests that appear multiple times.

Strengths:

* What users consistently like.
* Features or benefits frequently praised.

Weaknesses:

* What users consistently dislike.
* Areas where users report dissatisfaction.

Pain Points:

* Frustrations, obstacles, complaints, or unmet needs.
* Issues causing negative experiences.

Feature Requests:

* Missing functionality.
* Requested improvements.
* Desired integrations or capabilities.

Target Users:

* User groups that appear to receive the most value.
* Infer only when supported by review evidence.

Important:

If a finding is not supported by the reviews, do not include it.

Return structured output only.
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