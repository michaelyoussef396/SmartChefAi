#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify, session
from flask_restful import Resource
from flask_bcrypt import Bcrypt

# Local imports
from config import app, db, api
from models import User, Recipe, Ingredient, Category  # Import models

# Initialize Bcrypt
bcrypt = Bcrypt(app)

# Views go here!
@app.route("/register", methods=["POST"])
def register_user():
    data = request.json
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")  # Directly use the plaintext password

    if not all([first_name, last_name, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    user_exists = User.query.filter_by(email=email).first() is not None
    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=password  # Store the plaintext password
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id  # Set user_id in session
        return jsonify({
            "id": new_user.id,
            "first_name": new_user.first_name,
            "last_name": new_user.last_name,
            "email": new_user.email
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")  # Print the error to the console
        return jsonify({"error": "An error occurred while registering the user"}), 500

@app.route("/login", methods=["POST"])
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not user.verify_password(password):
        return jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    }), 200

@app.route("/recipes", methods=["POST"])
def create_recipe():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    title = data.get("title")
    description = data.get("description")
    instructions = data.get("instructions")
    ingredients = data.get("ingredients")
    categories = data.get("categories")

    if not all([title, instructions, ingredients]):
        return jsonify({"error": "Title, instructions, and ingredients are required."}), 400

    try:
        # Create new recipe
        new_recipe = Recipe(
            title=title,
            description=description,
            instructions=instructions,
            user_id=session['user_id']
        )
        db.session.add(new_recipe)
        db.session.commit()  # Commit to generate recipe ID

        # Add ingredients
        for ingredient_data in ingredients:
            ingredient = Ingredient(
                name=ingredient_data["name"],
                quantity=ingredient_data["quantity"],
                recipe_id=new_recipe.id
            )
            db.session.add(ingredient)

        # Add categories (if provided)
        if categories:
            for category_name in categories:
                category = Category.query.filter_by(name=category_name).first()
                if not category:
                    category = Category(name=category_name)
                    db.session.add(category)
                    db.session.commit()
                
                new_recipe.categories.append(category)

        db.session.commit()  # Final commit to save all changes

        return jsonify({
            "id": new_recipe.id,
            "title": new_recipe.title,
            "description": new_recipe.description,
            "instructions": new_recipe.instructions,
            "ingredients": [{"name": ing.name, "quantity": ing.quantity} for ing in new_recipe.ingredients],
            "categories": [cat.name for cat in new_recipe.categories]
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while creating the recipe."}), 500
    

@app.route("/recipes", methods=["GET"])
def get_recipes():
    try:
        recipes = Recipe.query.all()
        return jsonify([
            {
                "id": recipe.id,
                "title": recipe.title,
                "description": recipe.description,
                "instructions": recipe.instructions,
                "ingredients": [{"name": ing.name, "quantity": ing.quantity} for ing in recipe.ingredients],
                "categories": [cat.name for cat in recipe.categories]
            } for recipe in recipes
        ]), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while retrieving recipes."}), 500




@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)
