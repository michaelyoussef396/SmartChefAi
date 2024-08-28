from sqlalchemy_serializer import SerializerMixin
from config import db

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
