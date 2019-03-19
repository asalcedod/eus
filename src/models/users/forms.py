# Python imports
from wtforms import IntegerField, PasswordField, StringField
from wtforms.validators import Email, EqualTo, InputRequired, Length

# Flask imports
from flask_wtf import FlaskForm


class RecoverPasswordForm(FlaskForm):
    email = StringField('Email',  validators=[InputRequired(), Email(message='Correo electrónico inválido')])


class ConfirmForm(FlaskForm):
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8)])
    confirm_password = PasswordField('Password', validators=[InputRequired(), EqualTo('password')])


class LoginForm(FlaskForm):
    email = StringField('Email',  validators=[InputRequired(), Email(message='Correo electrónico inválido')])
    password = PasswordField('Password', validators=[InputRequired()])


class CreateUserForm(FlaskForm):
    name = StringField('Full name',  validators=[InputRequired()])
    email = StringField('Email',  validators=[InputRequired(), Email(message='Invalid email')])
    id = IntegerField('Email',  validators=[InputRequired()])
