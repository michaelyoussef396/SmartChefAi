#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Recipe, Ingredient, Category

fake = Faker()

# Example list of common ingredients
common_ingredients = [
    "salt", "sugar", "flour", "olive oil", "garlic", "onion", "tomato", 
    "chicken", "beef", "carrot", "butter", "milk", "pepper", "basil",
    "oregano", "thyme", "rosemary", "parsley", "cinnamon", "ginger"
]

def clear_users():
    """Delete all users from the database."""
    User.query.delete()
    db.session.commit()
    print("Deleted all users.")

def seed_users(n=10):
    """Seed the database with fake users."""
    for _ in range(n):
        user = User(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.email(),
            password=fake.password()  # For simplicity, we use fake passwords here
        )
        db.session.add(user)
    db.session.commit()
    print(f"Seeded {n} users.")

def seed_categories():
    """Seed the database with default categories."""
    categories = ["Palestinian", "Grilled", "Beef", "Vegetarian", "Dessert"]
    for category_name in categories:
        category = Category(name=category_name)
        db.session.add(category)
    db.session.commit()
    print("Seeded categories.")

def seed_recipes(n=20):
    """Seed the database with fake recipes and associated ingredients and categories."""
    users = User.query.all()
    categories = Category.query.all()
    
    for _ in range(n):
        user = rc(users)
        recipe = Recipe(
            title=fake.sentence(nb_words=3),
            image=f"{fake.word()}.jpg",  # Fake image names
            description=fake.text(),
            instructions=[fake.sentence() for _ in range(5)],  # Fake instructions list
            user_id=user.id
        )
        db.session.add(recipe)
        db.session.commit()  # Commit to generate recipe ID

        # Add random ingredients
        for _ in range(randint(3, 10)):
            ingredient = Ingredient(
                name=rc(common_ingredients),  # Randomly select from common ingredients
                quantity=f"{randint(1, 5)} {fake.word()}",
                recipe_id=recipe.id
            )
            db.session.add(ingredient)

        # Associate random categories
        selected_categories = fake.random_elements(elements=categories, length=randint(1, 3), unique=True)
        for category in selected_categories:
            recipe.categories.append(category)

    db.session.commit()
    print(f"Seeded {n} recipes with ingredients and categories.")

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")

        # Clear existing data
        clear_users()

        # Seed data
        seed_users()
        seed_categories()
        seed_recipes()

        print("Seeding completed!")
