#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from flask_migrate import Migrate

from config import app, db
from models import User


if __name__ == '__main__':
    faker = Faker()

with app.app_context():
    print('Seeding...')
    db.create_all()

    db.session.query(User).delete()
    db.session.query(SessionLog).delete()

    for i in range(10):
        password = faker.password()
        user_data = {
            'username': faker.user_name(),
            'email': faker.email(),
            'password': password,
            'first_name': faker.first_name(),
            'last_name': faker.last_name(),
        }
        user = User(**user_data)
        db.session.add(user)

        session_log = SessionLog(user_id=user.id, user_data=user_data)
        db.session.add(session_log)

    db.session.commit()




















