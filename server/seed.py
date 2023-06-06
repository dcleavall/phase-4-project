#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db

def create_user():
    fake = Faker()
    user = User(
        name=fake.name(),
        age=randint(18, 99),
        email=fake.email(),
        password=fake.password()
    )
    db.session.add(user)
    db.session.commit()


if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
