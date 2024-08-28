#!/usr/bin/env python3

# Standard library imports
# No need to import uuid4 anymore

# Remote library imports
from flask import request, jsonify, session
from flask_restful import Resource
from flask_bcrypt import Bcrypt

# Local imports
from config import app, db, api
from models import User

# Initialize Bcrypt
bcrypt = Bcrypt(app)

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

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=password  # Let the model handle the hashing
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

    # Find the user by email
    user = User.query.filter_by(email=email).first()

    # Check if the user exists
    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    # Verify the password
    if not user.verify_password(password):
        return jsonify({"error": "Unauthorized"}), 401
    
    # Set the user ID in the session
    session["user_id"] = user.id

    # Return the user data (excluding sensitive information)
    return jsonify({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email
    }), 200

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)