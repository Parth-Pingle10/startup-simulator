from pydantic import BaseModel


class MatchOutput(BaseModel):
    matched: bool


def is_matching_company(
    llm,
    competitor: str,
    trustpilot_result: str
):

    matcher_llm = llm.with_structured_output(
        MatchOutput
    )

    prompt = f"""
    Competitor:
    {competitor}

    Trustpilot Result:
    {trustpilot_result}

    Are these the same company?

    Return:
    matched = true or false
    """

    response = matcher_llm.invoke(prompt)

    if isinstance(response, dict):
        return response["matched"]

    return response.matched