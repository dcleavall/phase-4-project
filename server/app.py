from flask import Flask, make_response, jsonify, request, session, abort

from flask_restful import Api, Resource
from flask_cors import CORS
from config import db, app, api
from models import User
from datetime import datetime
import logging
from sqlalchemy.orm import Session


@app.route('/')

def index():
    return "Hello, Guest!"

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
            return {
                "message": "Login successful",
                "user_id": user.id
            }
        else:
            return {
                "message": "Login failed"
            }, 401

class AuthorizationSession(Resource):
    def get(self):
        if 'user_id' in session and session['loggedIn']:
            user_id = session['user_id']
            user = User.query.get(user_id)
            if user:
                return user.to_dict(), 200
        abort(401, "Unauthorized")

class Logout(Resource):
    def delete(self):
        if 'user_id' in session and session['loggedIn']:
            user_id = session['user_id']
            user = User.query.get(user_id)

            if user:
                if user.id == session['user_id']:
                    session.clear()
                    session['end_time'] = datetime.now().isoformat()

                    logging.info(f"User logged out: {user.username}")

                    return {"message": "Logout successful", "user": user.to_dict()}

        abort(401, "Unauthorized")

api.add_resource(Users, '/users')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(AuthorizationSession, '/authorized')
api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)



    
