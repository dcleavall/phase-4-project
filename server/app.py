from flask import Flask, make_response, jsonify, request, session, abort
from flask_restful import Api, Resource
from flask_cors import CORS
from config import db, app, api
from models import User, SessionLog, Exercise, Nutrition, Mindfulness
from datetime import datetime
import logging

# Define route handlers
@app.route('/')
def index():
    return "Hello World!"

class Users(Resource):
    def get(self):
        users = User.query.all()
        response = make_response(
            jsonify([user.to_dict() for user in users]),
            200
        )
        return response

class Signup(Resource):
    def post(self):
        form_json = request.get_json()
        email = form_json['email']

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            abort(409, "Email already exists")

        new_user = User(
            username=form_json['username'],
            email=form_json['email'],
            password_hash=form_json['password'],
            first_name=form_json['firstName'],
            last_name=form_json['lastName']
        )

        try:
            db.session.add(new_user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            abort(500, f"Failed to create user: {str(e)}")

        response = make_response(new_user.to_dict(), 201)
        return response

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data['username']
        password = data['password']

        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            session.clear()
            session['user_id'] = user.id
            session['loggedIn'] = True
            session['start_time'] = datetime.now().isoformat()

            session_log = SessionLog(user_id=user.id)
            db.session.add(session_log)
            db.session.commit()

            return {
                "message": "Login successful",
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name
                }
            }
        else:
            return {
                "message": "Login failed"
            }, 401


class AuthorizationSession(Resource):
    def get(self):
        if 'user_id' in session and session['loggedIn']:
            user_id = session['user_id']
            user = User.query.filter_by(id=user_id).first()  # Alternative query
            if user:
                # Retrieve the session logs for the user
                session_logs = SessionLog.query.filter_by(user_id=user_id).all()

                # Serialize the session logs
                serialized_session_logs = [session_log.to_dict() for session_log in session_logs]

                return user.to_dict(), 200

        abort(401, "Unauthorized")


class Logout(Resource):
    def delete(self):
        if 'user_id' in session and session['loggedIn']:
            user_id = session['user_id']
            user = User.query.filter_by(id=user_id).first()  # Alternative query

            if user:
                # Check if the user being logged out matches the user stored in the session
                if user.id == session['user_id']:
                    session.clear()  # Clear all session variables
                    session['end_time'] = datetime.now().isoformat()

                    # Log the session to the SessionLog table
                    session_log = SessionLog.query.filter_by(user_id=user.id, logout_time=None).first()
                    session_log.logout_time = datetime.now()
                    db.session.commit()

                    logging.info(f"User logged out: {user.username}")  # Log the user object

                    return {"message": "Logout successful", "user": user.to_dict()}

        abort(401, "Unauthorized")

class DeleteUser(Resource):
    def delete(self):
        if 'user_id' in session and session['loggedIn']:
            user_id = session['user_id']
            user = User.query.filter_by(id=user_id).first()

            if user:
                try:
                    # Delete the session logs for the user
                    SessionLog.query.filter_by(user_id=user_id).delete()

                    # Delete the user
                    db.session.delete(user)
                    db.session.commit()

                    session.clear()  # Clear all session variables

                    return {"message": "User deleted successfully"}, 200
                except Exception as e:
                    db.session.rollback()
                    return {"message": f"Failed to delete user: {str(e)}"}, 500

        abort(401, "Unauthorized")


class Exercises(Resource):
    def get(self):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return {'message': 'Unauthorized'}, 401

        return [e.to_dict() for e in user.exercises], 200

    def post(self):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return {'message': 'Unauthorized'}, 401

        exercise_data = request.get_json()
        exercise_type = exercise_data.get('type')

        try:
            exercise = Exercise(
                user_id=user_id,
                name='',
                type=exercise_type,
                muscle_group=exercise_data.get('muscle_group') if exercise_type == 'weightlifting' else None,
                duration=exercise_data['duration'],
                distance=exercise_data.get('distance') if exercise_type == 'cardio' else None,
                notes=exercise_data['notes']
            )

            db.session.add(exercise)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {'message': 'Error updating exercise data: {}'.format(str(e))}, 500

        return {'message': 'Exercise data submitted successfully'}, 201


class ExerciseID(Resource):
    def get(self, id):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return {'message': 'Unauthorized'}, 401

        exercise = Exercise.query.filter_by(id=id).first()

        if not exercise:
            return {'message': 'Exercise not found'}, 404

        return exercise.to_dict(), 200

    def delete(self, id):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()
        exercise = Exercise.query.filter_by(id=id).first()

        if not exercise:
            return {'message': 'Exercise not found'}, 404

        if not user or exercise.user_id != user_id:
            return {'message': 'Unauthorized'}, 401

        db.session.delete(exercise)
        db.session.commit()

        return {'message': 'Exercise deleted successfully'}, 200

    def patch(self, id):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()
        exercise = Exercise.query.filter_by(id=id).first()

        if not exercise:
            return {'message': 'Exercise not found'}, 404

        if not user or exercise.user_id != user_id:
            return {'message': 'Unauthorized'}, 401

        exercise_data = request.get_json()

        if not exercise_data:
            return {'message': 'Invalid exercise data'}, 400

        updated_exercise_data = {
            'type': exercise_data.get('type', exercise.type),
            'muscle_group': exercise_data.get('muscle_group', exercise.muscle_group),
            'duration': exercise_data.get('duration', exercise.duration),
            'distance': exercise_data.get('distance', exercise.distance),
            'notes': exercise_data.get('notes', exercise.notes)
        }

        exercise.type = updated_exercise_data['type']
        exercise.muscle_group = updated_exercise_data['muscle_group']
        exercise.duration = updated_exercise_data['duration']
        exercise.distance = updated_exercise_data['distance']
        exercise.notes = updated_exercise_data['notes']

        try:
            db.session.commit()
            return {'message': 'Exercise updated successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': 'Error updating exercise data: {}'.format(str(e))}, 422





class Nutritions(Resource):
    def get(self):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return {'message': 'Unauthorized'}, 401

        return [n.to_dict() for n in user.nutritions], 200

    def post(self):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return {'message': 'Unauthorized'}, 401

        nutrition_data = request.get_json()

        try:
            nutrition = Nutrition(
                user_id=user_id,
                name='',
                meal=nutrition_data.get('meal'),
                protein=nutrition_data.get('protein'),
                fat=nutrition_data.get('fats'),  # Update 'fat' to 'fats'
                carbs=nutrition_data.get('carbs'),
                macros=nutrition_data.get('macros'),
                goals=nutrition_data.get('goals')
            )

            db.session.add(nutrition)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {'message': 'Error updating nutrition data: {}'.format(str(e))}, 500

        return {'message': 'Nutrition data submitted successfully'}, 201


class NutritionID(Resource):
    def get(self, id):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()
        nutrition = Nutrition.query.filter_by(id=id).first()

        if not nutrition:
            return {'message': 'Nutrition not found'}, 404

        return nutrition.to_dict(), 200

    def delete(self, id):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()
        nutrition = Nutrition.query.filter_by(id=id).first()

        if not nutrition:
            return {'message': 'Nutrition not found'}, 404

        if not user or nutrition.user_id != user_id:
            return {'message': 'Unauthorized'}, 401

        db.session.delete(nutrition)
        db.session.commit()

        return {'message': 'Nutrition deleted successfully'}, 200
    
    
    # def delete(self):
    #     user_id = session.get('user_id')

    #     if not user_id:
    #         return {'message': 'Unauthorized'}, 401

    #     nutrition = Nutrition.query.filter_by(user_id=user_id).first()

    #     if not nutrition:
    #         return {'message': 'Nutrition not found'}, 404

    #     db.session.delete(nutrition)
    #     db.session.commit()


#     def patch(self):
#         pass


class Mindfulnesss(Resource):
    def get(self):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return {'message': 'Unauthorized'}, 401

        return [m.to_dict() for m in user.mindfulnesss], 200

    def post(self):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return {'message': 'Unauthorized'}, 401

        mindfulness_data = request.get_json()

        try:
            mindfulness = Mindfulness(
                user_id=user_id,
                name='',
                type=mindfulness_data.get('type'),
                duration=mindfulness_data.get('duration'),
                notes=mindfulness_data.get('notes')
            )

            db.session.add(mindfulness)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {'message': 'Error updating mindfulness data: {}'.format(str(e))}, 500

        return {'message': 'Mindfulness data submitted successfully'}, 201

class MindfulnessID(Resource):
    def get(self, id):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()
        mindfulness = Mindfulness.query.filter_by(id=id).first()

        if not mindfulness:
            return {'message': 'Mindfulness not found'}, 404

        return mindfulness.to_dict(), 200

    def delete(self, id):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()
        mindfulness = Mindfulness.query.filter_by(id=id).first()

        if not mindfulness:
            return {'message': 'Mindfulness not found'}, 404

        if not user or mindfulness.user_id != user_id:
            return {'message': 'Unauthorized'}, 401

        db.session.delete(mindfulness)
        db.session.commit()

        return {'message': 'Mindfulness deleted successfully'}, 200

    def patch(self, id):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()
        mindfulness = Mindfulness.query.get(id)

        if not mindfulness:
            return {'message': 'Mindfulness not found'}, 404

        if not user or mindfulness.user_id != user_id:
            return {'message': 'Unauthorized'}, 401

        mindfulness_data = request.get_json()
        
        if not mindfulness_data:
            return {'message': 'Invalid data'}, 400

        # Update the mindfulness entry with the new data
        mindfulness.type = mindfulness_data.get('type', mindfulness.type)
        mindfulness.duration = mindfulness_data.get('duration', mindfulness.duration)
        mindfulness.notes = mindfulness_data.get('notes', mindfulness.notes)

        db.session.commit()

        return {'message': 'Mindfulness updated successfully'}, 200


            





# Add resource routes
api.add_resource(Users, '/users')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(AuthorizationSession, '/authorized')
api.add_resource(Logout, '/logout')
api.add_resource(DeleteUser, '/delete-user')
api.add_resource(ExerciseID, '/exercises/<int:id>')
api.add_resource(Exercises, '/exercises')
api.add_resource(Nutritions, '/nutrition')
api.add_resource(NutritionID, '/nutrition/<int:id>')
api.add_resource(Mindfulnesss, '/mindfulness')
api.add_resource(MindfulnessID, '/mindfulness/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True) 





    
