from agent_llm.agent_9 import agent9_llm

def adoption_analytics_agent(state):

    prompt = f"""
    You are an expert startup analyst, market researcher, and customer insights specialist.

Your task is to analyze aggregated customer feedback and identify overall market sentiment toward the startup.

Persona Feedback:
{state["persona_feedback"]}

Analysis Rules:

* Base conclusions ONLY on the provided persona feedback.
* Do NOT invent opinions that are not present.
* Look for recurring themes and patterns.
* Prioritize evidence that appears across multiple personas.
* Consider both positive and negative feedback.
* Use actual adoption scores, concerns, and recommendations when drawing conclusions.

Tasks:

1. Estimate overall adoption probability.

   * Consider how many personas would realistically use the product.
   * Consider average adoption scores.
   * Consider enthusiasm levels.

2. Estimate payment probability.

   * Consider how many personas would pay.
   * Consider budget concerns.
   * Consider perceived value.

3. Estimate recommendation probability.

   * Consider how many personas would recommend the product.
   * Consider satisfaction and confidence levels.

4. Calculate average adoption score.

   * Use persona adoption scores as evidence.

5. Identify most requested features.

   * Focus on features repeatedly requested by multiple personas.
   * Ignore one-off suggestions.

6. Identify top concerns.

   * Focus on recurring objections and adoption barriers.

7. Identify strongest selling points.

   * Features and benefits consistently praised.

8. Identify likely early adopters.

   * Personas with high adoption scores and positive sentiment.

9. Identify likely rejectors.

   * Personas with low adoption scores and strong objections.

10. Identify major adoption barriers.

    * What is preventing broader adoption?

11. Identify key opportunities for improvement.

    * Which improvements would most increase adoption?

Probability Guidelines:

0-20:
Very unlikely.

21-40:
Unlikely.

41-60:
Moderate.

61-80:
Likely.

81-100:
Highly likely.

Important:

Probabilities must be justified by persona feedback.

Do not assign high probabilities unless the feedback strongly supports them.

Return structured output only.
    """

    response = agent9_llm.invoke(prompt)

    if isinstance(response, dict):

        analytics = response

    else:

        analytics = response.model_dump()

    return {
        "adoption_analytics": analytics
    }