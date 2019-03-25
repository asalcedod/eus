# -*- coding: utf-8 -*-
import os

# Development configuration
DEBUG = True
ENV = 'development'
# DEBUG = False
# ENV = 'production'

# Application directory
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Static paths
STATIC = os.path.join(BASE_DIR, 'src', 'static', 'resources')
UPLOAD_PATH = os.path.join(STATIC, 'img', 'posts')
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'avi', 'flv', 'mp4', 'wmv', 'mov', 'webm'])

# Flask security
SECRET_KEY = b'J\xd5%is\xe2M\xf5T^\x16\x13`-\x87\xfc'
SECURITY_PASSWORD_SALT = os.urandom(16)

# MongoDB settings
MONGODB_SETTINGS = {
    'db': 'eus',
    'host': 'mongodb://%s:%s@127.0.0.1:27017'
}

# Gmail configuration
MAIL_SERVER = "smtp.gmail.com"
MAIL_PORT = 465
MAIL_USE_SSL = True
MAIL_USERNAME = 'ing.asalcedod@gmail.com'
MAIL_PASSWORD = 'gjbhfzsjmjeqtjfn'
