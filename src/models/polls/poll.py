# Python imports
import uuid

# Project imports
from src.common.database import Database
import src.models.polls.constants as poll_constants


class Poll(object):
    def __init__(self, title, questions, author, timestamp, published=False, users=None, _id=None):
        self._id = uuid.uuid4().hex if _id is None else _id
        self.title = title
        self.questions = questions
        self.author = author
        self.timestamp = timestamp
        self.published = published
        self.users = [] if users is None else users

    def __repr__(self):
        return "<Poll '{}', by {} at {}.>".format(self.title, self.author, self.timestamp)

    @classmethod
    def find_by_id(cls, _id):
        try:
            return cls(**Database.find_one(poll_constants.COLLECTION, {'_id': _id}))
        except TypeError:
            return None

    @classmethod
    def find_by_title(cls, title):
        try:
            return cls(**Database.find_one(poll_constants.COLLECTION, {'title': title}))
        except TypeError:
            return None

    @classmethod
    def find_by_author(cls, author):
        try:
            return [poll for poll in Database.find(collection=poll_constants.COLLECTION,
                                                   query={'author': author})]
        except TypeError:
            return None

    @staticmethod
    def get_all():
        polls = [poll for poll in Database.find(collection=poll_constants.COLLECTION,
                                                query={})]

        if len(polls) > 0:
            return reversed(sorted(polls, key=lambda k: k['timestamp']))
        else:
            return False

    def get_questions(self):
        return [question for question in self.questions]

    def get_answers(self, question):
        return [answer for answer in self.questions[question]]

    def save_to_db(self):
        Database.insert(poll_constants.COLLECTION, self.json())

    def update(self):
        Database.update(poll_constants.COLLECTION, {'_id': self._id}, {'$set': self.json()})

    def delete(self):
        Database.remove(poll_constants.COLLECTION, {'_id': self._id})

    def json(self):
        return {
            '_id': self._id,
            'title': self.title,
            'questions': self.questions,
            'author': self.author,
            'timestamp': self.timestamp,
            'published': self.published,
            'users': self.users
        }
