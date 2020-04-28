from flask_sqlalchemy import SQLAlchemy
# from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    ingredients = db.relationship('MyIngredients',backref='user', lazy=True)

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

class MyIngredients(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(40))

def toDict(self):
    return{
        'id':self.id,
        'userid':self.userid,
        'name':self.name
    }