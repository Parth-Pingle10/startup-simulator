import os

from dotenv import load_dotenv

from langchain_google_genai import (
    ChatGoogleGenerativeAI
)

from langchain_ollama import ChatOllama

from langchain_openai import (
    ChatOpenAI
)

load_dotenv()


class LLMManager:

    def __init__(self):

        # self.primary = (
        #     ChatGoogleGenerativeAI(
        #         model="gemini-2.5-flash",
        #         google_api_key=os.getenv(
        #             "GOOGLE_API_KEY"
        #         ),
        #         temperature=0
        #     )
        # )
        self.primary = (
            ChatOllama(
                
                model="mistral:latest",
                temperature=0
            )
        )

        self.fallback = (
            ChatOpenAI(
                model="deepseek/deepseek-chat-v3",

                api_key=os.getenv(
                    "OPENROUTER_API_KEY"
                ),

                base_url=
                "https://openrouter.ai/api/v1",

                temperature=0
            )
        )

    def get_llm(self):

        return self.primary

    def invoke(
        self,
        prompt
    ):

        try:

            print(
                "\nUsing Gemini...\n"
            )

            return self.primary.invoke(
                prompt
            )

        except Exception as e:

            print(
                f"\nGemini Failed: {e}"
            )

            print(
                "\nSwitching To DeepSeek...\n"
            )

            return self.fallback.invoke(
                prompt
            )
    def get_structured_llm(
    self,
    schema
):

        primary = (
            self.primary.with_structured_output(
            schema
        )
    )

        fallback = (
            self.fallback.with_structured_output(
            schema
        )
    )

        return primary, fallback


llm_manager = LLMManager()