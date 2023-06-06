#main funtion to run ther server, handle request and response, and connect to the database
from flask import Flask, make_response, jsonify, request
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS, cross_origin
from models import db
from config import *

# from models import db


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)

db.init_app(app)

api = Api(app)

# Views go here!

@app.route('/')
@cross_origin()
def index():
    pass



if __name__ == '__main__':
    app.run(port=5555, debug=True)
    app.config.from_object('config')
