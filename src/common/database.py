# Python imports
import os
import pymongo


class Database(object):
    URI = os.environ.get('MONGOLAB_URI')
    # URI = "mongodb://localhost:27017"
    DATABASE = None

    @staticmethod
    def initialize():
        client = pymongo.MongoClient(Database.URI,
                                     serverSelectionTimeoutMS=10)
        client.server_info()
        Database.DATABASE = client['eus']

    @staticmethod
    def find(collection, query):
        return Database.DATABASE[collection].find(query)

    @staticmethod
    def find_one(collection, query, query2=None):
        return Database.DATABASE[collection].find_one(query, query2)

    @staticmethod
    def insert(collection, data):
        Database.DATABASE[collection].insert(data)

    @staticmethod
    def update(collection, query, data):
        Database.DATABASE[collection].update_one(query, data)

    @staticmethod
    def remove(collection, query):
        Database.DATABASE[collection].remove(query)
