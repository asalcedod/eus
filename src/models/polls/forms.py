# Python imports
from wtforms import StringField
from wtforms.validators import InputRequired

# Flask imports
from flask_wtf import FlaskForm


class PollForm(FlaskForm):
    title = StringField('Título')
