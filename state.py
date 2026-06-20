from typing import TypedDict, List, Dict, Any

class StartupState(TypedDict):

    startup_name: str
    problem: str
    solution: str
    target_users: str

    one_line_description: str
    key_features: List[str]

    competitors: List[str]

    competitor_research: List[Dict[str, Any]]

    competitor_insights: List[Dict[str, Any]]

    market_gaps: Dict[str, Any]

    startup_score: Dict[str, Any]

    personas: List[Dict[str, Any]]

    persona_feedback: List[Dict[str, Any]]

    adoption_analytics: Dict[str, Any]

    final_report: Dict[str, Any]