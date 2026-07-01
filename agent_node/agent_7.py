from agent_state.agent_7 import PersonaOutput
from utils.structured_invoke import invoke_structured
from utils.logger import logger
from utils.agent_runner import run_agent
import time

async def persona_generator_agent(state):
    
    async def execute():
        
        logger.info(
            f"Agent 7 Started | {state['startup_name']}"
        )

        prompt = f"""
        You are an expert consumer psychologist, startup researcher, and customer segmentation specialist.

    Your task is to generate realistic customer personas that represent potential users of the startup.

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

    Generate EXACTLY 15 distinct personas.

    The personas must represent different customer archetypes, not simply different names.

    Use competitor frustrations, pain points, feature requests, and market gaps when creating personas.

    Persona Distribution:

    * 3 Enthusiastic Early Adopters
    * 3 Practical Buyers
    * 3 Budget-Conscious Users
    * 3 Skeptical Users
    * 3 Non-Users / Likely Rejectors

    Each persona must have:

    * Unique goals
    * Unique frustrations
    * Unique buying behavior
    * Unique expectations
    * Unique reasons for adoption or rejection

    Persona Rules:

    * Do not create duplicate personas.
    * Do not simply change age or name.
    * Each persona should represent a meaningful customer segment.
    * Base frustrations on actual competitor research whenever possible.
    * Include personas that strongly dislike the startup.
    * Include personas that are undecided.
    * Include personas that are highly likely to adopt.

    Adoption Likelihood Rules:

    High:
    Likely to use and pay.

    Medium:
    Interested but uncertain.

    Low:
    Unlikely to use or pay.

    Persona Categories Should Include Examples Such As:

    * Power Users
    * Beginners
    * Casual Users
    * Budget-Conscious Users
    * Skeptics
    * Busy Professionals
    * Students
    * Advanced Users
    * Feature-Focused Users
    * Convenience-Focused Users

    Important:

    The goal is to simulate realistic market behavior.

    Do not make every persona like the startup.

    At least 30% of personas should be skeptical or unlikely to adopt.

    Return structured output only.
        """

        response = invoke_structured(
        PersonaOutput,
        prompt
    )

        if isinstance(response, dict):

            personas = response["personas"]

        else:

            personas = [
                p.model_dump()
                for p in response.personas
            ]
                    
        logger.info(
            f"Agent 7 Completed | {state['startup_name']}"
        )
  

        return {
            "personas": personas
        }
    
    return await run_agent(
        state,
        7,
        execute
    )