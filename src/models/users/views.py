# Flask imports
from flask import abort, Blueprint, flash, redirect, render_template, request, url_for
from flask_login import login_user, logout_user, login_required, current_user

# Project imports
from src.common.utils import Utils
from src.models.users.user import User
from src.models.users.decorators import requires_roles
from src.models.users.forms import ConfirmForm, CreateUserForm, LoginForm, RecoverPasswordForm

users_blueprint = Blueprint('users', __name__)


@users_blueprint.route('/crear-admin')
def create_admin():
    if User.find_by_admin('teacher') is None:
        name = 'Antonio Salcedo'
        email = 'ing.asalcedod@gmail.com'
        hash_password = Utils.hash_password('12345678')
        role = 'teacher'
        id = '1045719931'

        user = User(id, name, email, hash_password, role)
        user.authenticated = True
        login_user(user)
        user.save_to_db()

        return redirect(url_for('index'))

    return abort(404)


@users_blueprint.route('/ver-usuarios')
@login_required
@requires_roles('teacher')
def view_users():
    users = User.get_all()

    return render_template('users/view_users.html', users=users)


@users_blueprint.route('/agregar-usuarios', methods=['GET', 'POST'])
@login_required
@requires_roles('teacher')
def add_users():
    form = CreateUserForm()

    if request.method == 'POST':
        users = []
        messages = []
        error = []

        for j in range(len(request.form.getlist('name'))):
            name = request.form.getlist('name')[j]
            email = request.form.getlist('email')[j]
            id = str(request.form.getlist('id')[j])
            hash_password = Utils.hash_password('12345678')
            role = 'graduate'

            user = User(id, name, email, hash_password, role)
            user.authenticated = False
            users.append(user)

            if User.find_by_email(email) or User.find_by_idd(id):
                if User.find_by_email(email):
                    error.append(email)
                    messages.append("Correo: {}".format(email))
                else:
                    error.append(id)
                    messages.append("Cédula: {}".format(id))

        if len(error) > 0:
            flash("ERROR")
            flash("Ya existen uno o más usuarios con los siguientes datos:")
            for message in messages:
                flash(message)

            return render_template('users/add_users.html', form=form, users=users, error=error)
        else:
            for user in users:
                user.save_to_db()
                Utils.send_confirmation_email(user.name, user.email, user._id)

        return redirect(url_for('users.view_users'))

    return render_template('users/add_users.html', form=form)


@users_blueprint.route('/eliminar-usuario/<string:user_id>')
@login_required
@requires_roles('teacher')
def delete_user(user_id):
    user = User.find_by_id(user_id)
    user.delete()

    return redirect(url_for('users.view_users'))


@users_blueprint.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    error = False

    if request.method == 'POST':
        user = User.find_by_email(form.email.data)

        if user and Utils.check_hashed_password(form.password.data, user.password):
            user.authenticated = True
            user.update()
            login_user(user, remember=True)

            return redirect(url_for('index'))

        error = True

    return render_template('users/login.html', form=form, error=error)


@users_blueprint.route('/logout')
@login_required
def logout():
    user = current_user
    user.authenticated = False
    user.update()
    logout_user()

    return redirect(url_for('index'))


@users_blueprint.route('/confirmar-usuario/<string:user_id>', methods=["GET", "POST"])
def confirm_user(user_id):
    form = ConfirmForm()
    user = User.find_by_id(user_id)

    if user.confirmed:
        return abort(404)

    if form.validate_on_submit():
        password_secure = Utils.check_password_strength(form.password.data)

        if password_secure:
            user.password = Utils.hash_password(form.password.data)
            user.authenticated = True
            user.confirmed = True
            user.update()
            login_user(user, remember=True)

            return redirect(url_for('index'))

    return render_template('users/confirm_user.html', form=form, user=user)


@users_blueprint.route('/recuperar-contraseña', methods=["GET", "POST"])
def recover_password():
    form = RecoverPasswordForm()

    error = False

    if request.method == 'POST':
        user = User.find_by_email(request.form['email'])

        if user is not None:
            user.authenticated = False
            user.confirmed = False

            Utils.send_recover_password(user.name, user.email, user._id)

            flash('Correo electrónico enviado exitosamente.')
            flash('Favor de revisar su bandeja.')

            return redirect(url_for('index'))

        error = True

    return render_template('users/recover-password.html', form=form, error=error)
