# Python imports
import datetime
import os
from werkzeug.utils import secure_filename

# Flask imports
from flask import Blueprint, current_app, redirect, render_template, request, url_for
from flask_login import current_user, login_required

# Project imports
from src.models.posts.post import Post
from src.models.posts.forms import AddPostForm, EditPostForm
from src.models.users.decorators import requires_roles

posts_blueprint = Blueprint('posts', __name__)


@posts_blueprint.route('/crear-noticia', methods=['GET', 'POST'])
@login_required
@requires_roles('teacher')
def add_post():
    form = AddPostForm()

    if form.validate_on_submit():
        title = form.title.data
        content = form.content.data
        filename = False
        if form.file.name in request.files:
            file = request.files[form.file.name]
            filename = secure_filename(file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_PATH'], filename))
        author = current_user.name
        timestamp = datetime.datetime.today()
        published = (request.form['submit'] == 'Publicar')

        post = Post(title, content, filename, author, timestamp, published)
        post.save_to_db()

        return redirect(url_for('index', section='post'))

    return render_template('posts/add_post.html', form=form)


@posts_blueprint.route('/editar-noticia/<string:post_id>', methods=['GET', 'POST'])
@login_required
@requires_roles('teacher')
def edit_post(post_id):
    post = Post.find_by_id(post_id)
    form = EditPostForm()

    if form.validate_on_submit():
        post.title = form.title.data
        post.content = form.content.data
        if form.file.name in request.files:
            file = request.files[form.file.name]
            post.file = secure_filename(file.filename)
            file.save(os.path.join(current_app.config['STATIC_RESOURCES'], 'img', 'posts', post.file))

        post.published = (request.form['submit'] == 'Publicar')

        post.update()

        return redirect(url_for('index', section='post'))

    return render_template('posts/edit_post.html', form=form, post=post)


@posts_blueprint.route('/borrar-noticia/<string:post_id>')
@login_required
@requires_roles('teacher')
def delete_post(post_id):
    post = Post.find_by_id(post_id)
    if post.file:
        path = os.path.join(current_app.root_path, 'static', 'resources', 'img', 'posts')
        if os.path.exists(os.path.join(path, post.file)):
            os.remove(os.path.join(path, post.file))
    post.delete()

    return redirect(url_for('index', section='post'))


@posts_blueprint.route('/noticias/<string:post_id>')
@login_required
def view_post(post_id):
    post = Post.find_by_id(post_id)

    return render_template('posts/view_post.html', post=post)
