import os

from dotenv import load_dotenv
from langchain_ollama import ChatOllama

load_dotenv()


class LLMManager:

    def __init__(self):
        self._primary = None
        self._fallback = None

    def _build_primary(self):
        from langchain_google_genai import ChatGoogleGenerativeAI

        return ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0,
        )
        # return ChatOllama(
        #     model="mistral:latest",
        #     base_url="http://localhost:11434",
        #     temperature=0,
        # )

    def _build_fallback(self):
        from langchain_openai import ChatOpenAI

        return ChatOpenAI(
            model="deepseek/deepseek-chat-v3",
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
            temperature=0,
        )

    @property
    def primary(self):
        if self._primary is None:
            self._primary = self._build_primary()
        return self._primary

    @property
    def fallback(self):
        if self._fallback is None:
            self._fallback = self._build_fallback()
        return self._fallback

    def get_llm(self):
        return self.primary

    def invoke(self, prompt):
        try:
            print("\nUsing Gemini...\n")
            return self.primary.invoke(prompt)
        except Exception as e:
            print(f"\nGemini Failed: {e}")
            print("\nSwitching To DeepSeek...\n")
            return self.fallback.invoke(prompt)

    def get_structured_llm(self, schema):
        primary = self.primary.with_structured_output(schema)
        fallback = self.fallback.with_structured_output(schema)
        return primary, fallback


llm_manager = LLMManager()