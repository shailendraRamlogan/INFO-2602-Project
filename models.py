from flask_sqlalchemy import SQLAlchemy
# from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def toDict(self):
        return{
            'id':self.id,
            'name':self.name,
            'email':self.email,
            'password':self.password
        }

        #hashes the password parameter and stores it in the object
    def set_password(self, password):
        """Create hashed password."""
        self.password = generate_password_hash(password, method='sha256')
        
        #Returns true if the parameter is equal to the object's password property
    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password, password)
        
        #To String method
    def __repr__(self):
        return '<User {}>'.format(self.name)

class Ingredient(db.Model):
    iid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30))

    def toDict(self):
        return{
            'id':self.iid,
            'name':self.name
        }

class MyIngredients(db.Model):
    mid = db.Column(db.Integer, primary_key=True)
    iid = db.Column('iid', db.Integer, db.ForeignKey('ingredient.iid'))
    id = db.Column('id', db.Integer, db.ForeignKey('user.id'), nullable=False)
    #rid = db.Column('rid', db.Integer, db.ForeignKey('myrecipes.rid'), nullable=False)
    name = db.Column(db.String(180))
    #recipe = db.relationship('MyRecipes')

    def toDict(self):
        return{
            'id':self.iid,
            'name':self.name
        }

class MyRecipes(db.Model):
    rid = db.Column(db.Integer, primary_key=True)
    id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    #mid = db.Column(db.Integer, db.ForeignKey('myingredients.mid'), nullable=True)
    name = db.Column(db.String(120),  unique=True, nullable=False)
    recipe = db.Column(db.String(255), nullable=False)
    ingredients = db.Column(db.Text, nullable=False)

    def toDict(self):
        return{
            'rid':self.rid,
            'id':self.id,
            'name':self.name,
            'recipe':self.recipe,
            'ingredients': self.ingredients
        }