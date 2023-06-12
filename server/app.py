from flask import Flask, make_response, jsonify, request, session, abort
from flask_restful import Api, Resource
from flask_cors import CORS
from config import db, app, api
from models import User, SessionLog
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

                return serialized_session_logs, 200

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



# Add resource routes
api.add_resource(Users, '/users')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(AuthorizationSession, '/authorized')
api.add_resource(Logout, '/logout')
api.add_resource(DeleteUser, '/delete-user')

if __name__ == '__main__':
    app.run(port=5555, debug=True) 





    
