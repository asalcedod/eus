# Flask imports
from flask_mail import Mail, Message

# Python imports
from itsdangerous import URLSafeTimedSerializer
from passlib.hash import pbkdf2_sha512
import random
import re
import string

# Project imports
import src.app
import src.models.users.errors as user_errors


class Utils(object):
    @staticmethod
    def generate_random_pass(size=12):
        return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(size))

    @staticmethod
    def email_is_valid(email):
        email_address_matcher = re.compile('^[\w-]+@([\w-]+\.)+[\w]+$')

        return True if email_address_matcher.match(email) else False

    @staticmethod
    def generate_confirmation_token(email):
        serializer = URLSafeTimedSerializer(src.app.app.config['SECRET_KEY'])
        return serializer.dumps(email, salt=src.app.app.config['SECURITY_PASSWORD_SALT'])

    @staticmethod
    def confirm_token(token, expiration=86400):
        serializer = URLSafeTimedSerializer(src.app.app.config['SECRET_KEY'])
        try:
            email = serializer.loads(
                token,
                salt=src.app.app.config['SECURITY_PASSWORD_SALT'],
                max_age=expiration
            )
        except:
            raise user_errors.InvalidEmailVerificationError('The confirmation link is invalid or has expired.')
        return email

    @staticmethod
    def send_confirmation_email(name, email, user_id):
        mail = Mail(src.app.app)
        msg = Message("¡Te han invitado al sistema de Egresados de la Universidad de Sucre!",
                      recipients=[email],
                      sender=src.app.app.config['MAIL_USERNAME'])

        msg.body = "¡Hola, {}! Un profesor te ha invitado al sistema de encuestas y noticias de la Universad de " \
                   "Sucre.\n\n" \
                   "Para aceptar su invitación, haz click en el siguiente link y crea una contraseña:\n\n" \
                   "https//{}:5051/confirmar-usuario/{}".format(name, '52.14.142.228', user_id)

        mail.send(msg)

    @staticmethod
    def send_recover_password(name, email, user_id):
        mail = Mail(src.app.app)
        msg = Message("Recuperar Contraseña - Sistema de Egresados de la Universidad de Sucre",
                      recipients=[email],
                      sender=src.app.app.config['MAIL_USERNAME'])

        msg.body = "¡Hola, {}!\n\n" \
                   "Para recuperar tu contraseña, haz click en el siguiente link y crea una nueva:\n\n" \
                   "http://{}:5051/confirmar-usuario/{}".format(name, '52.14.142.228', user_id)

        mail.send(msg)

    @staticmethod
    def hash_password(password):
        """
        Hashes a password using pbkdf2_sha512

        :param password: The sha512 password from the login/register form

        :return: A sha512->pbkdf2_sha512 encrypted password
        """
        return pbkdf2_sha512.encrypt(password)

    @staticmethod
    def check_hashed_password(password, hashed_password):
        """
        Checks that the password the user sent matches that of the database.
        The database password is encrypted more than the user's password at this stage.

        :param password: sha512-hashed password
        :param hashed_password: pbkdf2_sha512 encrypted password

        :return: True if passwords match, False otherwise
        """
        return pbkdf2_sha512.verify(password, hashed_password)

    @staticmethod
    def check_password_strength(password=''):
        requirements = ['length', 'upper', 'lower', 'digits', 'nonWords']
        validators = {
            'length': len(password) > 8,
            'digits': re.match(r'\d', password),
            'lower': re.match(r'[a-z]', password),
            'upper': re.match(r'[A-Z]', password),
            'nonWords': re.match(r'\W', password)
        }
        validated = []

        for req in requirements:
            validated.append(validators[req])

        return not (False in validated)
