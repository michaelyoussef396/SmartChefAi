# SmartChefAi

SmartChefAi is a full-stack application that allows users to search, manage, and parse recipes using both a user-friendly React frontend and a Flask backend. It includes features for adding, updating, and deleting recipes, along with the ability to parse recipes from URLs using AI for ingredient and instruction extraction.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Setup](#database-setup)
- [API Routes](#api-routes)
- [Models](#models)
- [AI Parsing](#ai-parsing)
- [File Structure](#file-structure)
- [Conclusion](#conclusion)

## Project Overview

SmartChefAi is a recipe management system that enables users to create, retrieve, update, and delete recipes. It allows users to categorize recipes, associate ingredients with them, and automatically parse recipe details from URLs using GPT-based AI models.

This project integrates the following features:

- A React frontend for user interaction and recipe management.
- A Flask REST API for backend operations like handling recipes and categories.
- AI-powered recipe parsing for extracting instructions and ingredients from URLs.
- User authentication with registration and login functionality.
- Categorization and search features for better organization of recipes.

## Features

- **Recipe Management**: Add, view, edit, and delete recipes with associated ingredients and categories.
- **AI Recipe Parsing**: Automatically parse recipes from a URL using GPT-3.5-powered AI for extracting ingredients and instructions.
- **Categorization**: Organize recipes into categories and filter them based on categories.
- **User Authentication**: Register and log in to manage your personalized recipes.
- **Real-time Search**: Search recipes dynamically as you type.
- **Interactive UI**: Fully responsive user interface built with React and Tailwind CSS.

## Technologies Used

### Frontend

- **Next.js**: A React framework for building fast, server-side-rendered applications.
- **TypeScript**: For type safety in the frontend.
- **Tailwind CSS**: For styling and responsive design.
- **Framer Motion**: For smooth animations.

### Backend

- **Flask**: Python micro-framework used to build RESTful APIs.
- **SQLAlchemy**: ORM (Object Relational Mapper) for database management.
- **PostgreSQL**: Database used for storing recipes, ingredients, and categories.
- **Flask-RESTful**: Flask extension for creating REST APIs.
- **Flask-Bcrypt**: For password hashing.
- **OpenAI API**: For AI-powered recipe parsing.
- **Flask-Migrate**: For handling database migrations.

## Getting Started

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/SmartChefAi.git
   cd SmartChefAi/server

2. Create a virtual environment and install dependencies:
pipenv install
pipenv shell

3. Run the Flask server:
python app.py

The backend server should now be running on http://localhost:5555.

Frontend Setup

1. Navigate to the client directory:
cd ../client

2. Install dependencies:
npm install

3. Run the React application:
npm run dev

The frontend should now be running on http://localhost:3000.

Database Setup
1. Navigate to the server folder:
cd ../server

2. Initialize and upgrade the database:
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

3. (Optional) Seed the database with test data:
python seed.py

API Routes

User Routes
- POST /register: Register a new user.
- POST /login: Log in a user.

Recipe Routes
- GET /recipes: Fetch all recipes.
- POST /recipes: Create a new recipe.
- GET /recipes/ : Get a specific recipe by ID.
- PUT /recipes/ : Update an existing recipe.
- DELETE /recipes/ : Delete a recipe.

Category Routes
- GET /categories: Fetch all categories.
- POST /categories: Create a new category.
- DELETE /categories : Delete a category.

AI Recipe Parsing Route
- POST /parse-recipe: Parse a recipe from a URL using GPT-3.5.

Models

User
- id: Primary key.
- first_name: User’s first name.
- last_name: User’s last name.
- email: Unique email address.
- password: Hashed password for security.

Recipe

- id: Primary key.
- title: Recipe title.
- description: Recipe description.
- instructions: List of instructions in JSON format.
- categories: Many-to-many relationship with categories.
- ingredients: One-to-many relationship with ingredients.

Ingredient

- id: Primary key.
- name: Ingredient name.
- quantity: Quantity of the ingredient.
- recipe_id: Foreign key linking to a recipe.

Category

- id: Primary key.
- name: Category name.
- recipes: Many-to-many relationship with recipes.

AI Parsing
This project leverages OpenAI’s GPT-3.5 model for intelligent parsing of recipes from URLs. When a user submits a URL, the content is fetched, and the AI is used to extract the recipe title, ingredients, and instructions automatically.

File Structure
SmartChefAi/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── styles/
│       └── types/
│
├── server/
│   ├── app.py
│   ├── models.py
│   ├── config.py
│   ├── seed.py
│   └── migrations/
│
├── README.md
└── .env

Conclusion
SmartChefAi is a robust full-stack recipe management platform powered by AI, offering a user-friendly interface for searching, categorizing, and managing recipes. The AI parsing feature ensures that users can easily add recipes from external URLs.