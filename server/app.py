from flask import Flask, make_response, jsonify, request, session, abort
from flask_restful import Api, Resource
from flask_cors import CORS
from config import db, app, api
from models import User, SessionLog, Exercise, Nutrition, Mindfulness, Dashboard
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
        session['user_id'] = new_user.id
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

class PatchUser(Resource):
    def patch(self):
        if 'user_id' in session and session['loggedIn']:
            user_id = session['user_id']
            user = User.query.filter_by(id=user_id).first()

            if user:
                user_data = request.get_json()

                if not user_data:
                    return {'message': 'Invalid user data'}, 400

                user.username = user_data.get('username', user.username)
                user.email = user_data.get('email', user.email)
                user.first_name = user_data.get('firstName', user.first_name)
                user.last_name = user_data.get('lastName', user.last_name)  # Update last_name field

                try:
                    db.session.commit()
                except Exception as e:
                    db.session.rollback()
                    return {'message': 'Error updating user data: {}'.format(str(e))}, 500

                return {'message': 'User updated successfully'}, 200

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
        exercise = Exercise.query.get(id)

        if not exercise:
            return {'message': 'Exercise not found'}, 404

        if not user or exercise.user_id != user_id:
            return {'message': 'Unauthorized'}, 401

        exercise_data = request.get_json()

        if not exercise_data:
            return {'message': 'Invalid exercise data'}, 400

        exercise.type = exercise_data.get('type', exercise.type)
        exercise.muscle_group = exercise_data.get('muscle_group', exercise.muscle_group)
        exercise.duration = exercise_data.get('duration', exercise.duration)

        distance = exercise_data.get('distance')
        if distance == '':
            distance = None
        exercise.distance = distance

        exercise.notes = exercise_data.get('notes', exercise.notes)

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {'message': 'Error updating exercise data: {}'.format(str(e))}, 500

        return {'message': 'Exercise updated successfully'}, 200






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
                fat=nutrition_data.get('fat'),  # Update 'fat' to 'fats'
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

    def patch(self, id):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()
        nutrition = Nutrition.query.get(id)

        if not nutrition:
            return {'message': 'Nutrition not found'}, 404

        if not user or nutrition.user_id != user_id:
            return {'message': 'Unauthorized'}, 401

        nutrition_data = request.get_json()
        
        if not nutrition_data:
            return {'message': 'Invalid data'}, 400

        # Update the mindfulness entry with the new data
        nutrition.meal = nutrition_data.get('meal', nutrition.meal)
        nutrition.protein = nutrition_data.get('duration', nutrition.protein)
        nutrition.carbs = nutrition_data.get('carbs', nutrition.carbs)
        nutrition.fat = nutrition_data.get('fat', nutrition.fat)
        nutrition.macros = nutrition_data.get('macros', nutrition.macros)
        nutrition.goals = nutrition_data.get('goals', nutrition.goals)

        db.session.commit()

        return {'message': 'Nutrition updated successfully'}, 200



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
        dashboard_id = mindfulness_data.get('dashboard_id')  # Get dashboard_id from the request data

        try:
            mindfulness = Mindfulness(
                user_id=user_id,
                dashboard_id=dashboard_id,  # Assign dashboard_id from the request data
                name=mindfulness_data.get('name'),
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
        mindfulness.name= mindfulness_data.get('name', mindfulness.name)
        mindfulness.type = mindfulness_data.get('type', mindfulness.type)
        mindfulness.duration = mindfulness_data.get('duration', mindfulness.duration)
        mindfulness.notes = mindfulness_data.get('notes', mindfulness.notes)

        db.session.commit()

        return {'message': 'Mindfulness updated successfully'}, 200


class Dashboards(Resource):
    def get(self):
        # Implement the GET method to retrieve all dashboards for the logged-in user
        user_id = session.get('user_id')
        dashboards = Dashboard.query.filter_by(user_id=user_id).all()
        return [dashboard.to_dict() for dashboard in dashboards], 200

    def post(self):
        # Implement the POST method to add a new dashboard entry for the logged-in user
        user_id = session.get('user_id')
        data = request.get_json()

        # Make sure the request data contains the required fields
        if not data or not data.get('name'):
            return {'message': 'Invalid dashboard data'}, 400

        name = data.get('name')
        dashboard_type = data.get('type')
        duration = data.get('duration')
        notes = data.get('notes')

        # Create a new Dashboard instance and add it to the database
        try:
            dashboard = Dashboard(
                user_id=user_id,
                name=name,
                type=dashboard_type,
                duration=duration,
                notes=notes
            )
            db.session.add(dashboard)
            db.session.commit()
            return {'message': 'Dashboard created successfully'}, 201
        except Exception as e:
            db.session.rollback()
            return {'message': f'Error creating dashboard: {str(e)}'}, 500 

class DashboardID(Resource):
    def get(self, id):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()
        dashboard = Dashboard.query.get(id)

        if not dashboard:
            return {'message': 'Dashboard not found'}, 404

        if not user:
            return {'message': 'Unauthorized'}, 401

        # Assuming you have a 'to_dict()' method in the Dashboard model to serialize the data
        data = dashboard.to_dict()
        data['likes'] = dashboard.likes  # Include the like count in the response data
        return data, 200

    def put(self, id):
        user_id = session.get('user_id')
        user = User.query.filter_by(id=user_id).first()
        dashboard = Dashboard.query.get(id)

        if not dashboard:
            return {'message': 'Dashboard not found'}, 404

        if not user:
            return {'message': 'Unauthorized'}, 401

        likes_data = request.get_json()
        if 'liked' in likes_data:
            dashboard.likes = dashboard.likes + 1 if likes_data['liked'] else dashboard.likes - 1
            db.session.commit()

            return {'message': 'Likes updated successfully', 'likes': dashboard.likes}, 200
        else:
            return {'message': 'Invalid data'}, 400




# Add resource routes
api.add_resource(Users, '/users')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(AuthorizationSession, '/authorized')
api.add_resource(Logout, '/logout')
api.add_resource(DeleteUser, '/delete-user')
api.add_resource(PatchUser, '/patch-user')
api.add_resource(ExerciseID, '/exercises/<int:id>')
api.add_resource(Exercises, '/exercises')
api.add_resource(Nutritions, '/nutrition')
api.add_resource(NutritionID, '/nutrition/<int:id>')
api.add_resource(Mindfulnesss, '/mindfulness')
api.add_resource(MindfulnessID, '/mindfulness/<int:id>')
api.add_resource(Dashboards, '/dashboard')
api.add_resource(DashboardID, '/dashboard/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True) 





    
