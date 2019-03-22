# Python imports
import datetime
import os
from itertools import groupby

# Flask imports
from flask import Blueprint, redirect, render_template, request, url_for
from flask_login import current_user, login_required

# Project imports
from src.models.polls.poll import Poll
from src.models.polls.forms import PollForm
from src.models.users.decorators import requires_roles

polls_blueprint = Blueprint('polls', __name__)


@polls_blueprint.route('/crear-encuesta', methods=['GET', 'POST'])
@login_required
@requires_roles('teacher')
def add_poll():
    form = PollForm()

    if request.method == 'POST':
        types = request.form.getlist('q_type')
        contents = request.form.getlist('q_content')
        questions = []

        for j in range(len(request.form.getlist('q_type'))):
            question = dict()
            question['content'] = contents[j]
            question['type'] = types[j]
            question['answers'] = []

            if question['type'] != 'open':
                question['options'] = [answer for answer in request.form.getlist('answer_question_'+str(j+1))]
            if question['type'] == 'cuad':
                question['row'] = [answer for answer in request.form.getlist('row_question_'+str(j+1))]
                question['column'] = [answer for answer in request.form.getlist('colm_question_'+str(j+1))]
                question['n'] = len(request.form.getlist('row_question_'+str(j+1))) + len(request.form.getlist('colm_question_'+str(j+1)))

            questions.append(question)

        title = request.form['title']
        author = current_user.name
        timestamp = datetime.datetime.today()
        published = (request.form['submit'] == 'Publicar')

        poll = Poll(title, questions, author, timestamp, published)
        poll.save_to_db()

        return redirect(url_for('index'))

    return render_template('polls/add_poll.html', form=form)


@polls_blueprint.route('/editar-encuesta/<string:poll_id>', methods=['GET', 'POST'])
@login_required
@requires_roles('teacher')
def edit_poll(poll_id):
    form = PollForm()
    poll = Poll.find_by_id(poll_id)

    if request.method == 'POST':
        types = request.form.getlist('q_type')
        contents = request.form.getlist('q_content')
        questions = []

        for j in range(len(request.form.getlist('q_type'))):
            question = dict()
            question['content'] = contents[j]
            question['type'] = types[j]
            question['answers'] = []

            if question['type'] != 'open':
                question['options'] = [answer for answer in request.form.getlist('answer_question_' + str(j + 1))]
            if question['type'] == 'cuad':
                question['row'] = [answer for answer in request.form.getlist('row_question_' + str(j + 1))]
                question['column'] = [answer for answer in request.form.getlist('colm_question_' + str(j + 1))]
                question['n'] = len(request.form.getlist('row_question_'+str(j+1))) + len(request.form.getlist('colm_question_'+str(j+1)))

            questions.append(question)

        poll.title = request.form['title']
        poll.questions = questions
        poll.timestamp = datetime.datetime.today()
        poll.published = (request.form['submit'] == 'Publicar')

        poll.update()

        return redirect(url_for('index'))

    return render_template('polls/edit_poll.html', form=form, poll=poll)

@polls_blueprint.route('/copiar-encuesta/<string:poll_id>')
@login_required
@requires_roles('teacher')
def copy_poll(poll_id):
    poll = Poll.find_by_id(poll_id)

    title = poll.title+"-Copy"
    questions = poll.questions
    author = poll.author
    timestamp = datetime.datetime.today()
    published = False

    poll_copy = Poll(title, questions, author, timestamp, published)
    poll_copy.save_to_db()

    return redirect(url_for('index'))

@polls_blueprint.route('/borrar-encuesta/<string:poll_id>')
@login_required
@requires_roles('teacher')
def delete_poll(poll_id):
    poll = Poll.find_by_id(poll_id)
    poll.delete()

    return redirect(url_for('index'))


@polls_blueprint.route('/encuesta/<string:poll_id>', methods=['GET', 'POST'])
@login_required
def view_poll(poll_id):
    poll = Poll.find_by_id(poll_id)

    if current_user.role == 'teacher':
        questions = poll.get_questions()
        answers = []

        for question in questions:
            q_type = question['type']
            q_answers = question['answers']

            if q_type == 'open':
                answers.append(q_answers)
            elif q_type == 'pharagraf':
                if len(q_answers) <= 250:
                    answers.append(q_answers)
            elif q_type == 'cuad':
                for n_answer in q_answers:
                    q_answers.sort()
                    q_answers = [(key, len(list(group))) for key, group in groupby(n_answer)]
                    
                    column = question['column']

                    for j in range(len(column)):
                        try:
                            if column[j] not in q_answers[0]:
                                q_answers.insert(j, (column[j], 0))
                        except IndexError:
                            q_answers.append((column[j], 0))

                    data = [[answer[0] for answer in q_answers],
                            [answer[1] for answer in q_answers]
                            ]
                    answers.append(data)

            else:
                if q_type == 'multiple':
                    q_answers = [j for i in q_answers for j in i]

                q_answers.sort()
                q_answers = [(key, len(list(group))) for key, group in groupby(q_answers)]
                options = question['options']

                for j in range(len(options)):
                    try:
                        if options[j] not in q_answers[j]:
                            q_answers.insert(j, (options[j], 0))
                    except IndexError:
                        q_answers.append((options[j], 0))

                data = [[answer[0] for answer in q_answers],
                        [answer[1] for answer in q_answers]
                        ]

                answers.append(data)

        return render_template('polls/poll_answers.html', poll=poll, answers=answers)

    if request.method == 'POST':
        for q in range(len(poll.questions)):
            answer = request.form.getlist('answer_'+str(q + 1))

            if poll.questions[q]['type'] != 'multiple' and poll.questions[q]['type'] != 'cuad':
                answer = answer[0]
            elif poll.questions[q]['type'] == 'cuad':
                for r in range(len(poll.questions[q]['row'])):
                    row = request.form.getlist('row_answer_'+str(r + 1))
                    answer.append(row[0])

            poll.questions[q]['answers'].append(answer)

        if poll.users is None:
            poll.users = []

        poll.users.append(current_user._id)
        poll.update()

        return redirect(url_for('index'))

    return render_template('polls/answer_poll.html', poll=poll)
