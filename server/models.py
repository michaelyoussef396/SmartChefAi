from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from uuid import uuid4
from config import db
from werkzeug.security import generate_password_hash, check_password_hash

def get_uuid():
    return uuid4().hex

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(345), unique=True, nullable=False)
    _password = db.Column(db.String(255), nullable=False)

    @property
    def password(self):
        raise AttributeError('Password is not a readable attribute')

    @password.setter
    def password(self, password):
        self._password = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self._password, password)

    serialize_rules = ('-_password',)