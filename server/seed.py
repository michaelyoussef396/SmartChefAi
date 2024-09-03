#!/usr/bin/env python3

# Remote library imports
from sqlalchemy import text
from app import app
from models import db, Category

def delete_category_by_id(category_id):
    with app.app_context():
        # Delete all associations in recipe_category that reference this category
        db.session.execute(text(f'DELETE FROM recipe_category WHERE category_id = {category_id}'))
        db.session.commit()

        # Find the category by ID
        category = Category.query.get(category_id)
        if category:
            # Delete the category
            db.session.delete(category)
            db.session.commit()
            print(f"Category with ID {category_id} deleted successfully.")
        else:
            print(f"Category with ID {category_id} not found.")

if __name__ == '__main__':
    delete_category_by_id(5)
