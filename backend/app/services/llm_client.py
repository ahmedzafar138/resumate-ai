import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

_MODEL_NAME = "gemini-2.5-flash"
_CLIENT = None

def _get_client():
    global _CLIENT

    if _CLIENT is None:
        if not API_KEY:
            raise RuntimeError("GEMINI_API_KEY is not set in the environment or .env file")

        _CLIENT = genai.Client(api_key=API_KEY)

    return _CLIENT

def generate(prompt: str) -> str:
    response = _get_client().models.generate_content(
        model=_MODEL_NAME,
        contents=prompt,
    )
    return response.text