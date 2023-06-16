#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker
from flask_migrate import Migrate

from config import app, db
from models import User, HealthChoice, Nutrition, Exercise, SessionLog
# from sqlalchemy.ext.associationproxy import association_proxy 

faker = Faker()

if __name__ == '__main__':


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

            # Commit the changes to the User object to obtain a valid user_id
            db.session.commit()

            session_log = SessionLog(user_id=user.id, user_data=user_data)
            db.session.add(session_log)

        # Seed the Nutrition class
        nutrition_data = [
            {'name': 'Nutrition 1', 'calories': 100},
            {'name': 'Nutrition 2', 'calories': 200},
            {'name': 'Nutrition 3', 'calories': 300},
            # Add more nutrition data as needed
        ]

        for data in nutrition_data:
            nutrition = Nutrition(**data)
            db.session.add(nutrition)

        # Seed the Exercise class
        exercise_data = [
            {'name': 'Exercise 1', 'duration': 30},
            {'name': 'Exercise 2', 'duration': 45},
            {'name': 'Exercise 3', 'duration': 60},
            # Add more exercise data as needed
        ]

        for data in exercise_data:
            exercise = Exercise(**data)
            db.session.add(exercise)

        # Seed the HealthChoice class
        health_choices_data = [
            {'user_id': 1, 'nutrition_id': 1, 'exercise_id': 1},
            {'user_id': 2, 'nutrition_id': 2, 'exercise_id': 2},
            {'user_id': 3, 'nutrition_id': 3, 'exercise_id': 3},
            # Add more health choices data as needed
        ]

        for data in health_choices_data:
            health_choice = HealthChoice(**data)
            db.session.add(health_choice)

        db.session.commit()




















