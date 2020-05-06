import json
from flask_login import LoginManager, current_user, login_user, login_required
from flask import Flask, request, render_template, redirect, flash, url_for
from flask_jwt import JWT, jwt_required, current_identity
from sqlalchemy.exc import IntegrityError
from datetime import timedelta 

from models import db, User, MyIngredients, MyRecipes

login_manager = LoginManager()
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlite.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = "MYSECRET"
    app.config['JWT_EXPIRATION_DELTA'] = timedelta(days = 7)
    db.init_app(app)
    return app

app = create_app()

app.app_context().push()
db.create_all(app=app)

def authenticate(uname, password):
    #search for the specified user
    user = User.query.filter_by(name=uname).first()
    #if user is found and password matches
    if user and user.check_password(password):
        return user

def identity(payload):
    return User.query.get(payload['identity'])

jwt = JWT(app, authenticate, identity)

@app.route('/')
#@jwt_required()
def main():
    return app.send_static_file('index.html')

@app.route('/register')
def register():
    return render_template('signup.html') 

@app.route('/signup', methods=['POST'])
def signup():
    userdata = request.get_json()
    newuser = User(name=userdata['name'], email=userdata['email'])
    newuser.set_password(userdata['password'])
    try:
        db.session.add(newuser)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return 'Name or email already exists. Please Login or check that you have correctly entered your credentials.', 401
    return 'User ' + newuser.name+' created, Please Login to continue.', 201

@app.route('/myingredients')
@jwt_required()
def ingredients():
    return render_template('ingredients.html')

@app.route('/ingredients', methods=['POST'])
@jwt_required()
def addIngredient():
    userdata = request.get_json()
    ingredient = MyIngredients(name=userdata['name'], id=current_identity.id)
    db.session.add(ingredient)
    db.session.commit()
    return ingredient.name + ' added.', 201

@app.route('/ingredients', methods=['GET'])
@jwt_required()
def getIngredients():
    ingredients = MyIngredients.query.filter_by(id=current_identity.id).all()
    ingredients = [ingredient.toDict() for ingredient in ingredients]
    if ingredients == None:
        return 'There are currently no ingredients added to your list.', 200
    return json.dumps(ingredients), 200

@app.route('/ingredients', methods=['GET'])
@jwt_required()
def getIngredient():
    userdata= request.get_json()
    name = userdata['name']
    ingredient = MyIngredients.query.filter_by(id=current_identity.id, name=name).first()
    if ingredient == None:
        return 'No ingredient found.'
    return json.dumps(ingredient.toDict()),200

@app.route('/ingredients', methods=['DELETE'])
@jwt_required()
def deleteIngredient():
    userdata=request.get_json()
    name = userdata['name']
    ingredient = MyIngredients.query.filter_by(id=current_identity.id, name=name).first()
    if ingredient == None:
        return 'No ingredient named '+name, 403
    db.session.delete(ingredient)
    db.session.commit()
    return name + ' successfully removed.',202


@app.route('/recipe', methods=['POST'])
@jwt_required()
def addRecipe():
    userdata = request.get_json()
    recipe = MyRecipes(name=userdata['name'], id=current_identity.id, recipe=userdata['recipe'], ingredients=userdata['ingredients'])
    try:
        db.session.add(recipe)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return 'Recipe already added. Please view in the Recipe tab.', 401
    return 'Recipe ' + recipe.name+' added.', 201

@app.route('/recipe', methods=['GET'])
@jwt_required()
def getRecipes():
    recipes= MyRecipes.query.filter_by(id=current_identity.id).all()
    recipes = [recipe.toDict() for recipe in recipes]
    if recipes == None:
        return 'No recipes added.',200
    return json.dumps(recipes), 200

@app.route('/recipe/<name>', methods=['GET'])
@jwt_required()
def getRecipe(name):
    recipe = MyRecipes.query.filter_by(id=current_identity.id, name=name).first()
    if recipe == None:
        return 'No recipe captured.', 403
    return json.dumps(recipe.toDict()), 201

@app.route('/recipe/<rid>', methods=['DELETE'])
@jwt_required()
def deleteRecipe(rid):
    recipe = MyRecipes.query.filter_by(id=current_identity.id, rid=rid).first()
    name= recipe.name
    if recipe == None:
        return 'No recipe captured.', 403
    db.session.delete(recipe)
    db.session.commit()
    return name + ' successfully removed.',202


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8080,debug=True)
