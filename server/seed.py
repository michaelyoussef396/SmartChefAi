#!/usr/bin/env python3

from app import app
from models import db, Recipe, Ingredient, Category

def seed_data():
    with app.app_context():
        # Add or get the specific categories
        breakfast_category = Category.query.filter_by(name="Breakfast").first()
        if not breakfast_category:
            breakfast_category = Category(name="Breakfast")
            db.session.add(breakfast_category)

        meat_category = Category.query.filter_by(name="Meat").first()
        if not meat_category:
            meat_category = Category(name="Meat")
            db.session.add(meat_category)

        vegetarian_category = Category.query.filter_by(name="Vegetarian").first()
        if not vegetarian_category:
            vegetarian_category = Category(name="Vegetarian")
            db.session.add(vegetarian_category)

        db.session.commit()  # Commit to generate IDs for categories if they are new

        # Add "Steak and Eggs" recipe without an image
        steak_and_eggs = Recipe.query.filter_by(title="Steak and Eggs").first()
        if not steak_and_eggs:
            steak_and_eggs = Recipe(
                title="Steak and Eggs",
                description="A hearty breakfast of steak, eggs, and roasted potatoes.",
                instructions=[
                    "Preheat your oven to 400 F.",
                    "Toss the potatoes with olive oil and seasoning, then roast for 20 minutes.",
                    "Heat a pan over high heat, season the steak, and sear on both sides.",
                    "Rest the steak for 10 minutes before slicing.",
                    "Cook the eggs in the same pan and serve with steak and potatoes."
                ]
            )
            db.session.add(steak_and_eggs)
            db.session.flush()  # Flush to get the recipe ID

            # Add ingredients for "Steak and Eggs"
            ingredients_steak_and_eggs = [
                Ingredient(name="Baby Yukon Gold Potatoes", quantity="1 lb", recipe_id=steak_and_eggs.id),
                Ingredient(name="Olive Oil", quantity="¼ cup", recipe_id=steak_and_eggs.id),
                Ingredient(name="Favorite Seasoning Blend", quantity="2 Tbsp", recipe_id=steak_and_eggs.id),
                Ingredient(name="Ribeye or Preferred Steak Cut", quantity="1", recipe_id=steak_and_eggs.id),
                Ingredient(name="Kosher Salt", quantity="to taste", recipe_id=steak_and_eggs.id),
                Ingredient(name="Black Pepper", quantity="to taste", recipe_id=steak_and_eggs.id),
                Ingredient(name="Eggs", quantity="4", recipe_id=steak_and_eggs.id),
            ]
            db.session.add_all(ingredients_steak_and_eggs)

        # Associate "Steak and Eggs" with categories
        if breakfast_category not in steak_and_eggs.categories:
            steak_and_eggs.categories.append(breakfast_category)
        if meat_category not in steak_and_eggs.categories:
            steak_and_eggs.categories.append(meat_category)

        # Add "Shakshuka" recipe without an image
        shakshuka = Recipe.query.filter_by(title="Shakshuka").first()
        if not shakshuka:
            shakshuka = Recipe(
                title="Shakshuka",
                description="A flavorful and spicy dish of eggs poached in a rich tomato and bell pepper sauce.",
                instructions=[
                    "Heat a pan and cook the bell peppers until softened.",
                    "Add garlic, spices, tomato paste, and cook.",
                    "Add tomatoes, water, and sugar, and simmer until thickened.",
                    "Make wells in the sauce and crack the eggs into them.",
                    "Cook until the eggs are set, then garnish with parsley and optional cheese."
                ]
            )
            db.session.add(shakshuka)
            db.session.flush()  # Flush to get the recipe ID

            # Add ingredients for "Shakshuka"
            ingredients_shakshuka = [
                Ingredient(name="Bell Peppers", quantity="2 large, diced", recipe_id=shakshuka.id),
                Ingredient(name="Olive Oil", quantity="2 Tbsp", recipe_id=shakshuka.id),
                Ingredient(name="Garlic Paste", quantity="4 cloves or 2 Tbsp", recipe_id=shakshuka.id),
                Ingredient(name="Tomato Paste", quantity="1 Tbsp", recipe_id=shakshuka.id),
                Ingredient(name="Paprika", quantity="¼ tsp", recipe_id=shakshuka.id),
                Ingredient(name="Chili Powder", quantity="¼ tsp", recipe_id=shakshuka.id),
                Ingredient(name="Cumin", quantity="¼ tsp", recipe_id=shakshuka.id),
                Ingredient(name="Dried Oregano", quantity="¼ tsp", recipe_id=shakshuka.id),
                Ingredient(name="Kosher Salt", quantity="1 tsp", recipe_id=shakshuka.id),
                Ingredient(name="Diced Tomato", quantity="2 cups", recipe_id=shakshuka.id),
                Ingredient(name="Sugar", quantity="½ tsp", recipe_id=shakshuka.id),
                Ingredient(name="Water", quantity="¼ cup", recipe_id=shakshuka.id),
                Ingredient(name="Eggs", quantity="4", recipe_id=shakshuka.id),
                Ingredient(name="Fresh Parsley", quantity="2 Tbsp, chopped", recipe_id=shakshuka.id),
                Ingredient(name="Shredded Cheese", quantity="¼ cup (optional)", recipe_id=shakshuka.id),
            ]
            db.session.add_all(ingredients_shakshuka)

        # Associate "Shakshuka" with categories
        if breakfast_category not in shakshuka.categories:
            shakshuka.categories.append(breakfast_category)
        if vegetarian_category not in shakshuka.categories:
            shakshuka.categories.append(vegetarian_category)

        # Commit the transactions
        db.session.commit()
        print("Seed data added successfully.")

if __name__ == '__main__':
    seed_data()
