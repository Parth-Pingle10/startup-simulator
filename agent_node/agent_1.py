from agent_state.agent_1 import StartupAnalysis
from utils.structured_invoke import invoke_structured
from utils.logger import logger
import time

def startup_analyzer(state):
    start = time.time()
    
    
    logger.info(
        f"Agent 1 Started | {state['startup_name']}"
    )

    prompt1 = f"""
    You are a senior startup analyst and product strategist.

Analyze the startup information and identify the core product offering.

Startup Name:
{state["startup_name"]}

Problem:
{state["problem"]}

Solution:
{state["solution"]}

Target Users:
{state["target_users"]}

Tasks:

1. Create exactly ONE concise startup description.

   * Maximum 20 words.
   * Clearly explain what the startup does.
   * Mention the target user.
   * Mention the core value proposition.

2. Generate 5-10 realistic product features.

Feature Requirements:

* Features must directly solve the stated problem.
* Features must be useful for the target users.
* Features must be implementable in a real product.
* Features must be specific and actionable.

Do NOT generate:

* Generic buzzwords
* Marketing slogans
* Company goals
* Benefits disguised as features

Bad Examples:

* AI Powered
* Smart Dashboard
* Seamless Experience
* Personalized Solutions

Good Examples:

* AI-generated weekly workout plans
* Progress tracking with streaks
* Habit reminders via notifications
* Meal recommendation engine
* Peer accountability groups

Think like a product manager designing the first version of the startup.

Return only structured output.
    """

    response = invoke_structured(
    StartupAnalysis,
    prompt1
    )
    
    end = time.time()
    
    logger.info(
        f"Agent 1 Completed | {state['startup_name']}"
    )
    
    logger.info(
    f"Agent 1 Runtime: {end-start:.2f}s"
)


    return {
        "one_line_description": response.one_line_description,
        "key_features": response.key_features
    }