#!/usr/bin/env python3

# Standard library imports
from uuid import uuid4

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
        id=uuid4().hex,
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=hashed_password
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
        return jsonify({"error": "An error occurred while registering the user"}), 500

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

if __name__ == '__main__':
    app.run(port=5555, debug=True)