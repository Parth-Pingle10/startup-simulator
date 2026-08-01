import asyncio
from backend.agent_node.agent_1 import startup_analyzer

async def main():
    state = {
        'startup_name': 'Demo',
        'problem': 'Problem',
        'solution': 'Solution',
        'target_users': 'Users',
        'analysis_id': 'test',
        'user_id': 'test',
    }
    try:
        result = await startup_analyzer(state)
        print('RESULT', result)
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(main())
