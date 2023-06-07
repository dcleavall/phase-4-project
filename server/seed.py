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
        db.create_all()  # Create the database tables if they don't exist

        db.session.query(User).delete()

        Users = []

        for i in range(10):
            user_data = {
                'username': faker.user_name(),
                'email': faker.email(),
                'password_hash': faker.password(),
                'first_name': faker.first_name(),
                'last_name': faker.last_name(),
            }
            user = User(**user_data)
            Users.append(user)

        db.session.add_all(Users)
        db.session.commit()





