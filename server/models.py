from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.dialects.postgresql import JSON  # Import JSON type for lists

# Association table for many-to-many relationship between Recipe and Category
association_table = db.Table('recipe_category',
    db.Column('recipe_id', db.Integer, db.ForeignKey('recipes.id', ondelete="CASCADE"), primary_key=True),
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id', ondelete="CASCADE"), primary_key=True)
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

    serialize_rules = ('-_password',)

class Recipe(db.Model, SerializerMixin):
    __tablename__ = 'recipes'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    ingredients = db.relationship('Ingredient', backref='recipe', lazy=True, cascade="all, delete")
    instructions = db.Column(JSON, nullable=True)
    
    categories = db.relationship(
        'Category',
        secondary=association_table,
        backref='recipes_in_category',
        passive_deletes=True,  # Ensure SQLAlchemy relies on the DB for deleting association records
        overlaps="categories_for_recipe, recipes_in_category"
    )

    serialize_rules = ('-ingredients', '-categories', '-instructions')

class Ingredient(db.Model, SerializerMixin):
    __tablename__ = 'ingredients'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.String(100), nullable=False)
    
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id', ondelete="CASCADE"), nullable=False)

    serialize_rules = ('-recipe',)

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    
    recipes = db.relationship(
        'Recipe',
        secondary=association_table,
        backref='categories_for_recipe',
        passive_deletes=True,  # Ensure SQLAlchemy relies on the DB for deleting association records
        overlaps="categories_for_recipe, recipes_in_category"
    )

    serialize_rules = ('-recipes',)
