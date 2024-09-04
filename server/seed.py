#!/usr/bin/env python3

from app import app
from models import db, Recipe, Ingredient, Category

def delete_recipes_by_id_range(start_id, end_id):
    with app.app_context():
        # Delete recipes with IDs from start_id to end_id
        recipes_to_delete = Recipe.query.filter(Recipe.id.between(start_id, end_id)).all()
        for recipe in recipes_to_delete:
            db.session.delete(recipe)
        
        db.session.commit()  # Commit the deletion
        print(f"Deleted recipes with IDs between {start_id} and {end_id}.")

if __name__ == '__main__':
    delete_recipes_by_id_range(3, 10)
