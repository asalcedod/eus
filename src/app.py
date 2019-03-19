# Python imports
from datetime import datetime

# Flask imports
from flask import Flask, render_template, request
from flask_login import LoginManager

# Project imports
from src.common.database import Database
from src.models.users.user import User
from src.models.polls.poll import Poll
from src.models.posts.post import Post
import src.models.users.views
import src.models.polls.views
import src.models.posts.views

app = Flask(__name__)
app.config.from_object('config')
app.register_blueprint(src.models.users.views.users_blueprint)
app.register_blueprint(src.models.polls.views.polls_blueprint)
app.register_blueprint(src.models.posts.views.posts_blueprint)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'users.login'


@app.before_first_request
def init_db():
    Database.initialize()


@login_manager.user_loader
def user_loader(user_id):
    """Given *user_id*, return the associated User object.

    :param unicode user_id: user_id (_id) user to retrieve

    """
    return User.find_by_id(user_id)


@app.template_filter()
def timesince(dt, default="Hace unos momentos"):
    """
    Returns string representing "time since" e.g.
    3 days ago, 5 hours ago etc.
    """

    now = datetime.now()
    diff = now - dt

    periods = (
        (diff.days / 365, "año", "años"),
        (diff.days / 30, "mes", "meses"),
        (diff.days / 7, "semana", "semanas"),
        (diff.days, "día", "días"),
        (diff.seconds / 3600, "hora", "horas"),
        (diff.seconds / 60, "minuto", "minutos"),
        (diff.seconds, "segundo", "segundos"),
    )

    for period, singular, plural in periods:
        if int(period) >= 1:
            return "Hace %d %s." % (period, singular if int(period) == 1 else plural)

    return default


@app.route('/')
def index():
    polls = Poll.get_all()
    posts = Post.get_all()

    section = request.args.get('section', 'poll')

    return render_template("index.html", polls=polls, posts=posts, section=section)


@app.route('/sw.js', methods=['GET'])
def sw():
    return app.send_static_file('sw.js')
