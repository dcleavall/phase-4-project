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
                'password_hash': password,  # Set the password_hash property directly
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

        user_ids = []
        # Seed the Exercise class
        exercise_data = [
            {'user_id': 1, 'type': 'weightlifting', 'muscle_group': 'Chest', 'duration': 30, 'notes': 'Sample notes', 'distance': None},
            {'user_id': 2, 'type': 'cardio', 'muscle_group': '', 'duration': 45, 'notes': 'Sample notes', 'distance': 5.0},
            # Add more exercise data as needed
        ]

        for data in exercise_data:
            exercise = Exercise(
                user_id=data['user_id'],
                name='',
                type=data['type'],
                muscle_group=data['muscle_group'] if data['type'] == 'weightlifting' else '',
                duration=data['duration'],
                distance=data['distance'] if data['type'] == 'cardio' else None,
                notes=data['notes']
            )
            db.session.add(exercise)

        db.session.commit()

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




















