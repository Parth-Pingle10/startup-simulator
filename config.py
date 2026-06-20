from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="mistral:latest",
    temperature=0.2
)