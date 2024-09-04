# parsers.py

from bs4 import BeautifulSoup
import requests
from ai_models import use_gpt_for_parsing  # Import AI model function

def parse_recipe_from_url(url):
    try:
        # Get the HTML content from the URL
        response = requests.get(url)
        response.raise_for_status()

        # Parse the HTML using BeautifulSoup
        soup = BeautifulSoup(response.content, "html.parser")

        # Extract the title and description (Modify based on the site structure)
        title = soup.find("h1").get_text(strip=True) if soup.find("h1") else "Untitled"
        description = soup.find("meta", {"name": "description"}).get("content", "") if soup.find("meta", {"name": "description"}) else ""

        # Attempt to manually scrape the instructions and ingredients
        instructions = [step.get_text(strip=True) for step in soup.find_all("li", {"class": "instruction"})]
        ingredients = [{"name": ing.get_text(strip=True), "quantity": ""} for ing in soup.find_all("li", {"class": "ingredient"})]

        # If no instructions or ingredients are found, fallback to AI parsing
        if not instructions or not ingredients:
            # Convert the HTML into plain text for AI parsing
            text_content = soup.get_text(separator="\n", strip=True)

            # Use GPT to parse the text and extract recipe details
            ai_parsed_recipe = use_gpt_for_parsing(text_content)

            if ai_parsed_recipe:
                # Assuming the AI response returns instructions and ingredients in a structured text format.
                # This is an example parsing, you may need to adjust based on the AI response format.
                instructions_section = ai_parsed_recipe.split("\nInstructions:")[1].strip() if "\nInstructions:" in ai_parsed_recipe else ""
                ingredients_section = ai_parsed_recipe.split("\nIngredients:")[1].strip() if "\nIngredients:" in ai_parsed_recipe else ""

                return {
                    "title": title,
                    "description": description,
                    "instructions": instructions_section.split("\n") if instructions_section else [],
                    "ingredients": [{"name": i.strip(), "quantity": ""} for i in ingredients_section.split("\n") if ingredients_section]
                }

        return {
            "title": title,
            "description": description,
            "instructions": instructions,
            "ingredients": ingredients
        }

    except Exception as e:
        print(f"Error parsing URL: {e}")
        return None
