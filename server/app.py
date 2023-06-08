from flask import Flask, make_response, jsonify, request, session, abort
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from config import db, app, api
from models import User


@app.route('/')

def index():
    return 'Hello, world!'

class Users(Resource):
     def get(self):
         users = User.query.all()
         response = make_response(
             jsonify(
                 [user.to_dict() for user in users]
             ),
             200
         )
         return response

class Signup(Resource):
    def post(self):
         form_json = request.get_json()
         new_user = User(
         username=form_json['username'],
         email=form_json['email'],
         _password_hash=form_json['password'],
         first_name=form_json['firstName'],
         last_name=form_json['lastName']
         )
         new_user.password_hash = form_json['password']
         db.session.add(new_user)
         db.session.commit()

         response = make_response(
                 new_user.to_dict(),
                 201
             )
         return response



class Login(Resource):
    def post(self):
        user = User.query.filter_by(name=request.get_json()['name']).first()
        session['user_id'] = user.id
        response = make_response(
            user.to_dict(),
            200
        )
        return response

class AuthorizationSession(Resource):
    def get(self):
        user = User.query.filter_by(id=session['user_id']).first()
        if user:
            response = make_response(
                user.to_dict(),
                200
            )
            return response
        else:
            abort(401, "Unauthorized")

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        response = make_response('', 204)
        return response

api.add_resource(Users, '/users')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(AuthorizationSession, '/authorized')
api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)


    
