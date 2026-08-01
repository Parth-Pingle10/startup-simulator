import asyncio
from backend.config.llm_manager import llm_manager

async def main():
    try:
        resp = await llm_manager.primary.ainvoke('Say hello in one word')
        print('OK', type(resp).__name__)
        print(resp)
    except Exception as e:
        print('ERR', repr(e))

asyncio.run(main())
