# Python imports
from functools import wraps

# Flask imports
from flask import redirect, url_for
from flask_login import current_user


def requires_roles(*roles):
    def wrapper(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            if current_user.role not in roles:
                return redirect(url_for('index'))
            return f(*args, **kwargs)
        return wrapped
    return wrapper


def check_confirmed(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        if current_user.confirmed is False:
            # flash('Please confirm your account!', 'warning')
            return redirect(url_for('users.confirm_user', user_id=current_user._id))
        return func(*args, **kwargs)

    return decorated_function
