
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


    def __repr__(self):
        return f"<User {self.username}>"


class Nutrition(db.Model, SerializerMixin):
    __tablename__ = 'nutrition'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String, nullable=False, default='')
    meal = db.Column(db.String, nullable=False)
    protein = db.Column(db.Integer, nullable=False)
    fat = db.Column(db.Integer, nullable=False)
    carbs = db.Column(db.Integer, nullable=False)
    macros = db.Column(db.Integer, nullable = False)
    goals = db.Column(db.String, nullable=False)
    

    user = db.relationship('User', backref='nutritions')  # Updated backref relationship


    def __repr__(self):
        return f"<Nutrition id={self.id} name={self.name}>"

class Mindfulness(db.Model, SerializerMixin):
    __tablename__ = 'mindfulness'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    dashboard_id = db.Column(db.Integer, db.ForeignKey('dashboard.id'))
    name = db.Column(db.String, nullable=False, default='')
    type = db.Column(db.String, nullable=False, default='')
    duration = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.String, nullable=False)

    user = db.relationship('User', backref='mindfulnesss')
    # Use a different name for the backref in Mindfulness model
    related_dashboard = db.relationship('Dashboard', backref='mindfulness_entries', foreign_keys=[dashboard_id])

    def __init__(self, user_id, dashboard_id, name, type, duration, notes):
        self.user_id = user_id
        self.dashboard_id = dashboard_id
        self.name = name
        self.type = type
        self.duration = duration
        self.notes = notes

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'dashboard_id': self.dashboard_id,
            'name': self.name,
            'type': self.type,
            'duration': self.duration,
            'notes': self.notes
        }

    def __repr__(self):
        return f"<Mindfulness id={self.id} name={self.name}>"

class Dashboard(db.Model, SerializerMixin):
    __tablename__ = 'dashboard'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    name = db.Column(db.String, nullable=False, default='')
    type = db.Column(db.String, nullable=False, default='')
    duration = db.Column(db.Integer, nullable=False, default=0)
    notes = db.Column(db.String, nullable=False, default='')
    likes = db.Column(db.Integer, nullable=False, default=0)  # New column for tracking likes
    comments = db.Column(db.String, nullable=False, default='')  # New column for storing comments

    user = db.relationship('User', backref='dashboards')

    def __init__(self, user_id, name, type, duration, notes):
        self.user_id = user_id
        self.name = name
        self.type = type
        self.duration = duration
        self.notes = notes

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'type': self.type,
            'duration': self.duration,
            'notes': self.notes,
            'likes': self.likes,  # Include the likes in the serialization
            'comments': self.comments  # Include the comments in the serialization
        }

    def __repr__(self):
        return f"<Dashboard id={self.id} name={self.name}>"



class Exercise(db.Model, SerializerMixin):
    __tablename__ = 'exercise'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))  # Updated foreign key relationship
    name = db.Column(db.String, nullable=False, default='')
    type = db.Column(db.String, nullable=False, default='')
    muscle_group = db.Column(db.String, nullable=True, default='')
    duration = db.Column(db.Integer, nullable=False)
    distance = db.Column(db.Float, nullable=True)
    notes = db.Column(db.String, nullable=False, default='')

    user = db.relationship('User', backref='exercises')  # Updated backref relationship


    def __init__(self, user_id, name, type, muscle_group, duration, distance, notes):
        self.user_id = user_id
        self.name = name
        self.type = type
        self.muscle_group = muscle_group
        self.duration = duration
        self.distance = distance
        self.notes = notes

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'type': self.type,
            'muscle_group': self.muscle_group,
            'duration': self.duration,
            'distance': self.distance,
            'notes': self.notes
        }

    def __repr__(self):
        return f"<Exercise id={self.id} name={self.name}>"





    




