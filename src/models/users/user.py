# Python imports
import uuid

# Flask imports
from flask_login import UserMixin

# Project imports
from src.common.database import Database
import src.models.users.constants as user_constants


class User(UserMixin):
    def __init__(self, id, name, email, password, role, _id=None, authenticated=False, confirmed=False):
        self._id = uuid.uuid4().hex if _id is None else _id
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.role = role
        self.authenticated = authenticated
        self.confirmed = confirmed

    def __repr__(self):
        return "<User '{}'.>".format(self.name)

    def is_authenticated(self):
        return self.authenticated

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self._id

    @staticmethod
    def get_all():
        return [User.find_by_id(user['_id']) for user in Database.find(collection=user_constants.COLLECTION,
                                                                       query={'role': 'graduate'})]

    @classmethod
    def find_by_admin(cls, role):
        try:
            return cls(**Database.find_one(user_constants.COLLECTION, {'role': role}))
        except TypeError:
            return None

    @classmethod
    def find_by_id(cls, user_id):
        try:
            return cls(**Database.find_one(user_constants.COLLECTION, {'_id': user_id}))
        except TypeError:
            return None

    @classmethod
    def find_by_idd(cls, user_id):
        try:
            return cls(**Database.find_one(user_constants.COLLECTION, {'id': user_id}))
        except TypeError:
            return None

    @classmethod
    def find_by_email(cls, email):
        try:
            return cls(**Database.find_one(user_constants.COLLECTION, {'email': email}))
        except TypeError:
            return None

    def save_to_db(self):
        Database.insert(user_constants.COLLECTION, self.json())

    def update(self):
        Database.update(user_constants.COLLECTION, {'_id': self._id}, {'$set': self.json()})

    def delete(self):
        Database.remove(user_constants.COLLECTION, {'_id': self._id})

    def json(self):
        return {
            '_id': self._id,
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'password': self.password,
            'role': self.role,
            'authenticated': self.authenticated,
            'confirmed': self.confirmed
        }
