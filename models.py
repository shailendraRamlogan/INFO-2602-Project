from flask_sqlalchemy import SQLAlchemy
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
    name = db.Column(db.String(30), nullable=False, unique=True)

    def toDict(self):
        return{
            'id':self.iid,
            'name':self.name
        }
    
    def getId(self):
        return self.iid

class Recipe(db.Model):
    rid = db.Column(db.Integer, primary_key=True)
    id = db.Column('id', db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(120),  unique=True, nullable=False)
    img = db.Column(db.String(150), nullable=False)
    recipeUrl = db.Column(db.String(255), nullable=False)
    ingredients = db.Column(db.Text, nullable=False)

    def toDict(self):
        return{
            'rid':self.rid,
            'name':self.name,
            'image':self.img,
            'recipe':self.recipeUrl,
            'ingredients':self.ingredients
        }

class UserIngredient(db.Model):
    pid = db.Column(db.Integer, primary_key=True)
    iid = db.Column('iid', db.Integer, db.ForeignKey('ingredient.iid'))
    id = db.Column('id', db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(180),unique=True)
    qty = db.Column(db.Integer, nullable=False)

    def toDict(self):
        return{
            'id':self.iid,
            'name':self.name,
            'quantity':self.qty
        }

# class IngredientRecipe(db.Model):
#     irid = db.Column(db.Integer, primary_key=True)
#     pid = db.Column('pid', db.Integer, db.ForeignKey('useringredient.pid'))
#     rid = db.Column('rid', db.Integer, db.ForeignKey('recipe.rid'))
#     recipe = db.relationship('Recipe')

#     def toDict(self):
#         return{
#             'recipes':self.recipe.toDict()
#         }
