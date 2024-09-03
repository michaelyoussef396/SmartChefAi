#!/usr/bin/env python3

# Standard library imports
import os
# Remote library imports
from flask import request, jsonify, session
from flask_restful import Resource
from flask_bcrypt import Bcrypt
# Local imports
from config import app, db, api
from models import User, Recipe, Ingredient, Category  # Import models

# Initialize Bcrypt
bcrypt = Bcrypt(app)
UPLOAD_FOLDER = 'static/images'  # Define the upload folder
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# Views go here!
@app.route("/register", methods=["POST"])
def register_user():
    data = request.json
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")

    if not all([first_name, last_name, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    user_exists = User.query.filter_by(email=email).first() is not None
    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=password
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            "id": new_user.id,
            "first_name": new_user.first_name,
            "last_name": new_user.last_name,
            "email": new_user.email
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
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
    data = request.form
    title = data.get("title")
    description = data.get("description")
    instructions = data.getlist("instructions")  # Expecting instructions to be a list
    categories = data.get("categories", "").split(",")  # Assuming categories are comma-separated
    ingredients = []
    image = request.files.get("image")

    # Process ingredients from the form
    for key in request.form:
        if key.startswith("ingredients[") and key.endswith("][name]"):
            index = key[len("ingredients["):-len("][name]")]
            name = request.form[key]
            quantity = request.form.get(f"ingredients[{index}][quantity]")
            ingredients.append({"name": name, "quantity": quantity})


    try:
        # Create new recipe
        new_recipe = Recipe(
            title=title,
            description=description,
            instructions=instructions,
        )
        db.session.add(new_recipe)
        db.session.commit()

        # Process and add categories
        for category_name in categories:
            # Check if the category already exists in the database
            category = Category.query.filter_by(name=category_name.strip()).first()
            if not category:
                # If the category does not exist, create a new one
                category = Category(name=category_name.strip())
                db.session.add(category)
                db.session.commit()
            # Add the category to the new recipe
            new_recipe.categories.append(category)

        # Process and add ingredients
        for ingredient_data in ingredients:
            ingredient = Ingredient(
                name=ingredient_data["name"],
                quantity=ingredient_data["quantity"],
                recipe_id=new_recipe.id
            )
            db.session.add(ingredient)

        # Final commit to save all changes
        db.session.commit()

        return jsonify({
            "id": new_recipe.id,
            "title": new_recipe.title,
            "description": new_recipe.description,
            "instructions": new_recipe.instructions,
            "ingredients": [{"name": ing.name, "quantity": ing.quantity} for ing in new_recipe.ingredients],
            "categories": [cat.name for cat in new_recipe.categories],
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


@app.route("/recipes/<int:recipe_id>", methods=["GET"])
def get_recipe(recipe_id):
    try:
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({"error": "Recipe not found."}), 404

        return jsonify({
            "id": recipe.id,
            "title": recipe.title,
            "description": recipe.description,
            "instructions": recipe.instructions,
            "ingredients": [{"name": ing.name, "quantity": ing.quantity} for ing in recipe.ingredients],
            "categories": [cat.name for cat in recipe.categories]
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while retrieving the recipe."}), 500

@app.route("/recipes/<int:recipe_id>", methods=["PUT"])
def update_recipe(recipe_id):
    title = request.form.get("title")
    description = request.form.get("description")
    instructions = request.form.get("instructions").split("\n")  # Assuming instructions are sent as a multiline string
    categories = request.form.get("categories", "").split(",")  # Assuming categories are comma-separated
    ingredients = []

    # Process ingredients from the form
    for key in request.form:
        if key.startswith("ingredients[") and key.endswith("][name]"):
            index = key[len("ingredients["):-len("][name]")]
            name = request.form[key]
            quantity = request.form.get(f"ingredients[{index}][quantity]")
            ingredients.append({"name": name, "quantity": quantity})

    try:
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({"error": "Recipe not found."}), 404

        # Update the basic fields
        if title:
            recipe.title = title
        if description:
            recipe.description = description
        if instructions:
            recipe.instructions = instructions

        # Update ingredients
        Ingredient.query.filter_by(recipe_id=recipe_id).delete()  # Clear existing ingredients
        for ingredient_data in ingredients:
            ingredient = Ingredient(
                name=ingredient_data["name"],
                quantity=ingredient_data["quantity"],
                recipe_id=recipe_id
            )
            db.session.add(ingredient)

        # Update categories
        recipe.categories.clear()  # Clear existing categories
        for category_name in categories:
            category_name = category_name.strip()
            if category_name:  # Ensure it's not an empty string
                category = Category.query.filter_by(name=category_name).first()
                if not category:
                    category = Category(name=category_name)
                    db.session.add(category)
                    db.session.commit()
                recipe.categories.append(category)

        # Commit the changes
        db.session.commit()

        return jsonify({
            "id": recipe.id,
            "title": recipe.title,
            "description": recipe.description,
            "instructions": recipe.instructions,
            "ingredients": [{"name": ing.name, "quantity": ing.quantity} for ing in recipe.ingredients],
            "categories": [cat.name for cat in recipe.categories]
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while updating the recipe."}), 500

@app.route("/recipes/<int:recipe_id>", methods=["DELETE"])
def delete_recipe(recipe_id):
    try:
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({"error": "Recipe not found."}), 404

        db.session.delete(recipe)
        db.session.commit()

        return jsonify({"message": "Recipe deleted successfully."}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while deleting the recipe."}), 500

@app.route("/categories", methods=["POST"])
def create_category():
    data = request.json
    name = data.get("name")

    if not name:
        return jsonify({"error": "Category name is required."}), 400

    category_exists = Category.query.filter_by(name=name).first()
    if category_exists:
        return jsonify({"error": "Category already exists."}), 409

    try:
        new_category = Category(name=name)
        db.session.add(new_category)
        db.session.commit()

        return jsonify({
            "id": new_category.id,
            "name": new_category.name
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while creating the category."}), 500

@app.route("/categories", methods=["GET"])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify([
            {
                "id": category.id,
                "name": category.name
            } for category in categories
        ]), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while retrieving categories."}), 500
    
@app.route("/recipes/<int:recipe_id>/ingredients", methods=["POST"])
def add_ingredient(recipe_id):
    data = request.json
    name = data.get("name")
    quantity = data.get("quantity")

    if not all([name, quantity]):
        return jsonify({"error": "Name and quantity are required."}), 400

    try:
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({"error": "Recipe not found."}), 404

        new_ingredient = Ingredient(
            name=name,
            quantity=quantity,
            recipe_id=recipe_id
        )
        db.session.add(new_ingredient)
        db.session.commit()

        return jsonify({
            "id": new_ingredient.id,
            "name": new_ingredient.name,
            "quantity": new_ingredient.quantity
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while adding the ingredient."}), 500
    

@app.route("/recipes/<int:recipe_id>/ingredients", methods=["GET"])
def get_ingredients(recipe_id):
    try:
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({"error": "Recipe not found."}), 404

        ingredients = Ingredient.query.filter_by(recipe_id=recipe_id).all()

        return jsonify([
            {
                "id": ingredient.id,
                "name": ingredient.name,
                "quantity": ingredient.quantity
            } for ingredient in ingredients
        ]), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while retrieving ingredients."}), 500
    
@app.route("/recipes/<int:recipe_id>/categories/<int:category_id>", methods=["POST"])
def add_category_to_recipe(recipe_id, category_id):
    try:
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({"error": "Recipe not found."}), 404

        category = Category.query.get(category_id)
        if not category:
            return jsonify({"error": "Category not found."}), 404

        recipe.categories.append(category)
        db.session.commit()

        return jsonify({
            "message": f"Category '{category.name}' added to recipe '{recipe.title}'."
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while adding the category to the recipe."}), 500

@app.route("/recipes/<int:recipe_id>/categories/<int:category_id>", methods=["DELETE"])
def remove_category_from_recipe(recipe_id, category_id):
    try:
        recipe = Recipe.query.get(recipe_id)
        if not recipe:
            return jsonify({"error": "Recipe not found."}), 404

        category = Category.query.get(category_id)
        if not category:
            return jsonify({"error": "Category not found."}), 404

        if category in recipe.categories:
            recipe.categories.remove(category)
            db.session.commit()
            return jsonify({
                "message": f"Category '{category.name}' removed from recipe '{recipe.title}'."
            }), 200
        else:
            return jsonify({"error": "Category not associated with this recipe."}), 400

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while removing the category from the recipe."}), 500

@app.route("/users/<int:user_id>/recipes", methods=["GET"])
def get_user_recipes(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found."}), 404

        recipes = Recipe.query.filter_by(user_id=user_id).all()

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
        return jsonify({"error": "An error occurred while retrieving the user's recipes."}), 500

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)
