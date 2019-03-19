# Python imports
from wtforms import FileField, StringField
from wtforms.validators import InputRequired, Length
from wtforms.widgets import TextArea

# Flask imports
from flask_wtf import FlaskForm


class AddPostForm(FlaskForm):
    title = StringField('Title',  validators=[InputRequired()])
    content = StringField('Content', widget=TextArea())
    file = FileField('File')


class EditPostForm(FlaskForm):
    title = StringField('Title',  validators=[InputRequired()])
    content = StringField('Content', widget=TextArea())
    file = FileField('File')
