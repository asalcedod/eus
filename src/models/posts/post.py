# Python imports
import uuid

# Project imports
from src.common.database import Database
import src.models.posts.constants as post_constants


class Post(object):
    def __init__(self, title, content, file, author, timestamp, published=False, _id=None):
        self._id = uuid.uuid4().hex if _id is None else _id
        self.title = title
        self.content = content
        self.file = file
        self.author = author
        self.timestamp = timestamp
        self.published = published

    def __repr__(self):
        return "<Post '{}', by {} at {}.>".format(self.title, self.author, self.timestamp)

    @classmethod
    def find_by_id(cls, _id):
        try:
            return cls(**Database.find_one(post_constants.COLLECTION, {'_id': _id}))
        except TypeError:
            return None

    @classmethod
    def find_by_title(cls, title):
        try:
            return cls(**Database.find_one(post_constants.COLLECTION, {'title': title}))
        except TypeError:
            return None

    @classmethod
    def find_by_author(cls, author):
        try:
            return [post for post in Database.find(collection=post_constants.COLLECTION,
                                                   query={'author': author})]
        except TypeError:
            return None

    @staticmethod
    def get_all():
        posts = [post for post in Database.find(collection=post_constants.COLLECTION,
                                                query={})]

        if len(posts) > 0:
            return reversed(sorted(posts, key=lambda k: k['timestamp']))
        else:
            return False

    def save_to_db(self):
        Database.insert(post_constants.COLLECTION, self.json())

    def update(self):
        Database.update(post_constants.COLLECTION, {'_id': self._id}, {'$set': self.json()})

    def delete(self):
        Database.remove(post_constants.COLLECTION, {'_id': self._id})

    def json(self):
        return {
            '_id': self._id,
            'title': self.title,
            'content': self.content,
            'file': self.file,
            'author': self.author,
            'timestamp': self.timestamp,
            'published': self.published
        }
