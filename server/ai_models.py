# ai_models.py

import openai
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Retrieve the API key from the environment
openai.api_key = os.getenv("OPENAI_API_KEY")

def use_gpt_for_parsing(text):
    """
    This function sends the text content to GPT to intelligently extract recipe information.
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use the correct model
            messages=[
                {"role": "system", "content": "Extract the recipe details from the following text."},
                {"role": "user", "content": text}
            ]
        )
        return response.choices[0].message['content'].strip()
    except Exception as e:
        print(f"Error using GPT for parsing: {e}")
        return None
