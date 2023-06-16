
from flask_sqlalchemy import SQLAlchemy


from sqlalchemy import MetaData, Column, Integer, String, DateTime, ForeignKey, JSON

from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt
from datetime import datetime
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import relationship

convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)

bcrypt = Bcrypt()

class SessionLog(db.Model, SerializerMixin):
    __tablename__ = 'session_log'

    session_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    login_time = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    logout_time = db.Column(db.DateTime)
    user_data = db.Column(db.JSON)

    user = db.relationship('User', backref=db.backref('session_logs', lazy=True))

    def __init__(self, user_id=None, user_data=None):
        if user_id:
            self.user_id = user_id
        if user_data:
            self.user_data = user_data

    def __repr__(self):
        return f"<SessionLog session_id={self.session_id} user_id={self.user_id}>"

    def to_dict(self):
        return {
            "session_id": self.session_id,
            "user_id": self.user_id,
            "login_time": self.login_time.isoformat() if self.login_time else None,
            "logout_time": self.logout_time.isoformat() if self.logout_time else None,
            "user_data": self.user_data
        }


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)

    health_choices = db.relationship('HealthChoice', backref='user' )
    nutritions = association_proxy('health_choices', 'nutrition')
    serialize_only = ('username', 'email', 'first_name', 'last_name')
    

    @property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        if password is not None:
            password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
            self._password_hash = password_hash.decode('utf-8')
        else:
            self._password_hash = None

    def authenticate(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    # def __init__(self, username=None, email=None, password=None, first_name=None, last_name=None):
    #     if username:
    #         self.username = username
    #     if email:
    #         self.email = email
    #     if password:
    #         self._password_hash = password
    #     if first_name:
    #         self.first_name = first_name
    #     if last_name:
    #         self.last_name = last_name


    def __repr__(self):
        return f"<User {self.username}>"

class HealthChoice(db.Model, SerializerMixin):
    __tablename__ = 'selections'

    selection_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    nutrition_id = Column(Integer, ForeignKey('nutrition.id'), nullable=False)
    exercise_id = Column(Integer, ForeignKey('exercise.id'), nullable=False)


    def __init__(self, user_id=None, nutrition_id=None, exercise_id=None):
        if user_id:
            self.user_id = user_id
        if nutrition_id:
            self.nutrition_id = nutrition_id
        if exercise_id:
            self.exercise_id = exercise_id

    def __repr__(self):
        return f"<HealthChoice id={self.selection_id} user_id={self.user_id}>"

class Nutrition(db.Model, SerializerMixin):
    __tablename__ = 'nutrition'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    calories = Column(Integer, nullable=False)

    health_choices = relationship('HealthChoice', backref='nutrition')
    users = association_proxy('health_choices', 'user')

    def __repr__(self):
        return f"<Nutrition id={self.id} name={self.name}>"


class Exercise(db.Model, SerializerMixin):
    __tablename__ = 'exercise'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)

    health_choices = db.relationship('HealthChoice', backref='exercise')
    users = association_proxy('health_choices', 'user')
    

    def __repr__(self):
        return f"<Exercise id={self.id} name={self.name}>"





    




