from bs4 import BeautifulSoup
import requests
from ai_models import use_gpt_for_parsing  # Import AI model function

def parse_recipe_from_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, "html.parser")

        title = soup.find("h1").get_text(strip=True) if soup.find("h1") else "Untitled"
        description = soup.find("meta", {"name": "description"}).get("content", "") if soup.find("meta", {"name": "description"}) else ""

        instructions = [step.get_text(strip=True) for step in soup.find_all("li", {"class": "instruction"})]
        ingredients = [{"name": ing.get_text(strip=True), "quantity": ""} for ing in soup.find_all("li", {"class": "ingredient"})]
        categories = [cat.get_text(strip=True) for cat in soup.find_all("a", {"class": "category"})]

        if not instructions or not ingredients:
            text_content = soup.get_text(separator="\n", strip=True)
            ai_parsed_recipe = use_gpt_for_parsing(text_content)

            if ai_parsed_recipe:
                sections = ai_parsed_recipe.split("\n")
                title = sections[0].strip() if sections else "Untitled"
                description = sections[1].strip() if len(sections) > 1 else ""
                
                instructions_section = ""
                ingredients_section = ""
                categories_section = ""
                current_section = None

                for line in sections[2:]:
                    if line.startswith("Instructions:"):
                        current_section = "instructions"
                    elif line.startswith("Ingredients:"):
                        current_section = "ingredients"
                    elif line.startswith("Categories:"):
                        current_section = "categories"
                    elif current_section == "instructions":
                        instructions_section += line + "\n"
                    elif current_section == "ingredients":
                        ingredients_section += line + "\n"
                    elif current_section == "categories":
                        categories_section += line + "\n"

                instructions = instructions_section.strip().split("\n") if instructions_section else []
                ingredients = [{"name": i.strip(), "quantity": ""} for i in ingredients_section.strip().split("\n") if ingredients_section]
                categories = [cat.strip() for cat in categories_section.strip().split("\n") if categories_section]

        return {
            "title": title,
            "description": description,
            "instructions": instructions,
            "ingredients": ingredients,
            "categories": categories
        }

    except Exception as e:
        print(f"Error parsing URL: {e}")
        return None
