# Project imports
from src.app import app

if __name__ == '__main__':
    app.run(host='localhost', debug=app.config['DEBUG'], port=5050)
