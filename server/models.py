from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.dialects.postgresql import JSON  # Import JSON type for lists

# Association table for many-to-many relationship between Recipe and Category
association_table = db.Table('recipe_category',
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipes.id'), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id'), primary_key=True)
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(345), unique=True, nullable=False)
    _password = db.Column(db.String(255), nullable=False)

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, password):
        self._password = password

    def verify_password(self, password):
        return self._password == password

    # One-to-many relationship with Recipe
    recipes = db.relationship('Recipe', backref='user', lazy=True)

    serialize_rules = ('-_password',)

class Recipe(db.Model, SerializerMixin):
    __tablename__ = 'recipes'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    image = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    
    # One-to-many relationship with Ingredient
    ingredients = db.relationship('Ingredient', backref='recipe', lazy=True)
    
    # JSON field to store instructions as a list
    instructions = db.Column(JSON, nullable=True)
    
    # Foreign Key to link to the User model
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Many-to-many relationship with Category
    categories = db.relationship('Category', secondary=association_table, backref=db.backref('recipes', lazy=True))

    serialize_rules = ('-user', '-ingredients', '-categories', '-instructions')  # Exclude user, ingredients, categories, and instructions from serialization

