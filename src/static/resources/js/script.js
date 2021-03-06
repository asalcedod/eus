$(document).ready(function () {
    $.ajaxSetup({
        type: "POST",
        data: {},
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        contentType: 'application/json; charset=utf-8'
    });

    if (isMobile()) {
        $('link[rel="stylesheet"]').removeAttr('disabled');
        $('.left-container').detach().insertBefore('.main-container');
        $('.container').height($(window).height() - $('.header').height() - $('.left-container').height());
        $('.main-container').css('margin-top', $('.header').height() + $('.left-container').height());

        if ($('.container').data('container')) {
            videoResize();
        }
    }

    // Base helper functions
    (function ($) {
        resize();
        $('#blank-screen').hide();

        $(window).on('load resize', function () {
            resize();
            $('#blank-screen').hide();
        });

        function resize () {
            if (isMobile()) {
                $('.left-container').css('top', $('.header').height());
                $('.main-container').css('margin-top', $('.header').height() + $('.left-container').height());
                $('.container').height($(window).height() - $('.header').height() - $('.left-container').height());

                if ($('.container').data('container')) {
                    videoResize();
                }
            }
            else {
                $('.main-container').css('margin-top', $('.header').height());
            }
        }
    })(jQuery);

    $('.section-selector').on('click', function () {
        var btn = $(this);

        $('.right-container [data-section]').hide();
        $('.right-container [data-section='+btn.data('section')+']').show();
        $('.section-selector--active').removeClass('section-selector--active');
        $(this).addClass('section-selector--active');
    });

    if ($('.container').data('container') === 'add-post' || $('.container').data('container') === 'edit-post') {
        var imageTypes = ['jpg', 'jpeg', 'png', 'gif'],
            videoTypes = ['avi', 'mp4', 'webm', 'wvm', 'mov'];

        document.getElementById("file").onchange = function () {
            var reader = new FileReader(),
                extension = document.getElementById("file").files[0].name.split('.').pop().toLowerCase();

            reader.onload = function (e) {
                if (imageTypes.indexOf(extension) > -1) {
                    document.getElementById("video").style.display = "none";
                    document.getElementById("image-preview").style.display = "block";
                    document.getElementById("image-preview").src = e.target.result;
                }
                else if (videoTypes.indexOf(extension) > -1) {
                    document.getElementById("image-preview").style.display = "none";
                    document.getElementById("video").style.display = "block";
                    document.getElementById("video").src = e.target.result;
                }
                else {
                    document.getElementById("image-preview").style.display = "none";
                    document.getElementById("video").style.display = "none";
                }
            };

            // read the image file as a data URL.
            if (this.files.length > 0) {
                reader.readAsDataURL(this.files[0]);
            }
            else {
                document.getElementById("image-preview").style.display = "none";
                document.getElementById("video").style.display = "none";
            }
        };
    }

    /* Close flash messages container */
    $(document).on('click', '.flash-close', function () {
        $('.flash-messages-container').remove();
    });

    /* Open edit question modal */
    $(document).on('click', '.form__edit-question-type', function () {
        var question = $(this).parent(),
            questionTypes = question.parent().find('.form__question-types');

        questionTypes.attr('data-question', question.data('question'));
        questionTypes.show();
        questionTypes.find('.form__question-types-title').html(question.find('label[for=question]').html());
    });

    /* Edit question type */
    $('.form__question-types-btn').on('click', function () {
        /* Confirm */
        if ($(this).hasClass('form__question-types-btn--confirm')) {
            var question = $(this).parent().parent().attr('data-question'),
                q_type = $(this).parent().prev().find(':radio:checked').val(),
                qContainer = $('.form__poll-new-question[data-question='+ question +']');

            qContainer.find('input[name=q_type]').val(q_type);
            qContainer.find('.form__input-answers').attr('data-answer', q_type);
            qContainer.find('.form__input-answers *').remove();

            if (q_type === 'boolean') {
                qContainer.find('.form__input-answers').append('' +
                    '<fieldset class="form__answer-group">' +
                    '<input class="form__answer" type="radio" disabled>' +
                    '<input class="form__answer-label" type="text" value="Verdadero" name="answer_'+ question +'" style="display:none;"> Verdadero<br>' +
                    '<input class="form__answer" type="radio" disabled>' +
                    '<input class="form__answer-label" type="text" value="Falso" name="answer_'+ question +'" style="display:none;"> Falso' +
                    '</fieldset>');
            }
            else if (q_type === 'options') {
                qContainer.find('.form__input-answers').append('' +
                    '<fieldset class="form__answer-group" data-type="radio">\n' +
                    '<div class="form__answer-container">\n' +
                    '<input class="form__answer" type="radio" disabled>\n' +
                    '<input class="form__answer-label" type="text" name="answer_'+ question +'" placeholder="Respuesta...">\n' +
                    '</div>\n' +
                    '<div class="form__answer-container">\n' +
                    '<input class="form__answer" type="radio" disabled>\n' +
                    '<input class="form__answer-label" type="text" name="answer_'+ question +'" placeholder="Respuesta...">\n' +
                    '</div>\n' +
                    '<div class="form__answer-container">\n' +
                    '<input class="form__answer" type="radio" disabled>\n' +
                    '<input class="form__answer-label" type="text" name="answer_'+ question +'" placeholder="Respuesta...">\n' +
                    '<div class="form__answer-delete">\n'+
                    '<svg class="poll__delete-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">\n' +
                    '<path fill="#c00" d="M507.331 411.33c-0.002-0.002-0.004-0.004-0.006-0.005l-155.322-155.325 155.322-155.325c0.002-0.002 0.004-0.003 0.006-0.005 1.672-1.673 2.881-3.627 3.656-5.708 2.123-5.688 0.912-12.341-3.662-16.915l-73.373-73.373c-4.574-4.573-11.225-5.783-16.914-3.66-2.080 0.775-4.035 1.984-5.709 3.655 0 0.002-0.002 0.003-0.004 0.005l-155.324 155.326-155.324-155.325c-0.002-0.002-0.003-0.003-0.005-0.005-1.673-1.671-3.627-2.88-5.707-3.655-5.69-2.124-12.341-0.913-16.915 3.66l-73.374 73.374c-4.574 4.574-5.784 11.226-3.661 16.914 0.776 2.080 1.985 4.036 3.656 5.708 0.002 0.001 0.003 0.003 0.005 0.005l155.325 155.324-155.325 155.326c-0.001 0.002-0.003 0.003-0.004 0.005-1.671 1.673-2.88 3.627-3.657 5.707-2.124 5.688-0.913 12.341 3.661 16.915l73.374 73.373c4.575 4.574 11.226 5.784 16.915 3.661 2.080-0.776 4.035-1.985 5.708-3.656 0.001-0.002 0.003-0.003 0.005-0.005l155.324-155.325 155.324 155.325c0.002 0.001 0.004 0.003 0.006 0.004 1.674 1.672 3.627 2.881 5.707 3.657 5.689 2.123 12.342 0.913 16.914-3.661l73.373-73.374c4.574-4.574 5.785-11.227 3.662-16.915-0.776-2.080-1.985-4.034-3.657-5.707z"></path>\n' +
                    '</svg>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</fieldset>\n' +
                    '<div class="form__answer-add-container">\n' +
                    '<div class="form__answer-add-btn">' +
                    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">\n' +
                    '<path fill="#15431F" d="M352 288v-128h-64v128h-128v64h128v128h64v-128h128v-64h-128zM320 640c-176.731 0-320-143.269-320-320s143.269-320 320-320v0c176.731 0 320 143.269 320 320s-143.269 320-320 320v0z"></path>\n' +
                    '</svg>' +
                    '</div>\n' +
                    '</div>');
            }
            else if (q_type === 'list') {
                qContainer.find('.form__input-answers').append('' +
                    '<fieldset class="form__answer-group">\n' +
                    '<div class="form__answer-container">\n' +
                    '<input class="form__answer-label" type="text" name="answer_'+ question +'" placeholder="Respuesta...">\n' +
                    '</div>\n' +
                    '<div class="form__answer-container">\n' +
                    '<input class="form__answer-label" type="text" name="answer_'+ question +'" placeholder="Respuesta...">\n' +
                    '</div>\n' +
                    '<div class="form__answer-container">\n' +
                    '<input class="form__answer-label" type="text" name="answer_'+ question +'" placeholder="Respuesta...">\n' +
                    '<div class="form__answer-delete">\n'+
                    '<svg class="poll__delete-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">\n' +
                    '<path fill="#c00" d="M507.331 411.33c-0.002-0.002-0.004-0.004-0.006-0.005l-155.322-155.325 155.322-155.325c0.002-0.002 0.004-0.003 0.006-0.005 1.672-1.673 2.881-3.627 3.656-5.708 2.123-5.688 0.912-12.341-3.662-16.915l-73.373-73.373c-4.574-4.573-11.225-5.783-16.914-3.66-2.080 0.775-4.035 1.984-5.709 3.655 0 0.002-0.002 0.003-0.004 0.005l-155.324 155.326-155.324-155.325c-0.002-0.002-0.003-0.003-0.005-0.005-1.673-1.671-3.627-2.88-5.707-3.655-5.69-2.124-12.341-0.913-16.915 3.66l-73.374 73.374c-4.574 4.574-5.784 11.226-3.661 16.914 0.776 2.080 1.985 4.036 3.656 5.708 0.002 0.001 0.003 0.003 0.005 0.005l155.325 155.324-155.325 155.326c-0.001 0.002-0.003 0.003-0.004 0.005-1.671 1.673-2.88 3.627-3.657 5.707-2.124 5.688-0.913 12.341 3.661 16.915l73.374 73.373c4.575 4.574 11.226 5.784 16.915 3.661 2.080-0.776 4.035-1.985 5.708-3.656 0.001-0.002 0.003-0.003 0.005-0.005l155.324-155.325 155.324 155.325c0.002 0.001 0.004 0.003 0.006 0.004 1.674 1.672 3.627 2.881 5.707 3.657 5.689 2.123 12.342 0.913 16.914-3.661l73.373-73.374c4.574-4.574 5.785-11.227 3.662-16.915-0.776-2.080-1.985-4.034-3.657-5.707z"></path>\n' +
                    '</svg>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</fieldset>\n' +
                    '<div class="form__answer-add-container">\n' +
                    '<div id="form_list_answer-add-btn" class="form__answer-add-btn">' +
                    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">\n' +
                    '<path fill="#15431F" d="M352 288v-128h-64v128h-128v64h128v128h64v-128h128v-64h-128zM320 640c-176.731 0-320-143.269-320-320s143.269-320 320-320v0c176.731 0 320 143.269 320 320s-143.269 320-320 320v0z"></path>\n' +
                    '</svg>' +
                    '</div>\n' +
                    '</div>');
            }
            else if (q_type === 'cuad') {
                qContainer.find('.form__input-answers').append('' +
                    '<fieldset class="form__answer-group" data-type="radio">\n' +
                    '<div class="form__answer-container">\n' +
                    '<div>\n'+
                    '<input id="colm" class="form__answer-label" type="text" name="colm_'+ question +'" placeholder="Columna...">\n' +
                    '</div>\n'+
                    '</div>\n' +
                    '<div class="form__answer-container">\n' +
                    '<div>\n'+
                    '<input id="row" class="form__answer-label" type="text" name="row_'+ question +'" placeholder="Fila...">\n' +
                    '</div>\n'+
                    '</div>\n' +
                    '<div class="form__answer-container">\n' +
                    '<div>\n'+
                    '<input id="colm" class="form__answer-label" type="text" name="colm_'+ question +'" placeholder="Columna...">\n' +
                    '</div>\n'+
                    '</div>\n' +
                    '<div class="form__answer-container">\n' +
                    '<div>\n'+
                    '<input id="row" class="form__answer-label" type="text" name="row_'+ question +'" placeholder="Fila...">\n' +
                    '</div>\n'+
                    '</div>\n' +
                    '</fieldset>\n' +
                    '<div class="form__answer-add-container">\n' +
                    '<div class="form__answer_row-add-btn">' +
                    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">\n' +
                    '<path fill="#15431F" d="M352 288v-128h-64v128h-128v64h128v128h64v-128h128v-64h-128zM320 640c-176.731 0-320-143.269-320-320s143.269-320 320-320v0c176.731 0 320 143.269 320 320s-143.269 320-320 320v0z"></path>\n' +
                    '</svg>' +
                    'F</div>\n' +
                    '<div class="form__answer_column-add-btn">' +
                    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">\n' +
                    '<path fill="#15431F" d="M352 288v-128h-64v128h-128v64h128v128h64v-128h128v-64h-128zM320 640c-176.731 0-320-143.269-320-320s143.269-320 320-320v0c176.731 0 320 143.269 320 320s-143.269 320-320 320v0z"></path>\n' +
                    '</svg>' +
                    'C</div>\n' +
                    '</div>');
            }
            else if (q_type === 'multiple') {
                qContainer.find('.form__input-answers').append('<fieldset class="form__answer-group" data-type="checkbox">\n' +
                    '<div class="form__answer-container">\n' +
                    '<input class="form__answer" type="checkbox" disabled>\n' +
                    '<input class="form__answer-label" type="text" name="answer_'+ question +'" placeholder="Respuesta...">\n' +
                    '</div>\n' +
                    '<div class="form__answer-container">\n' +
                    '<input class="form__answer" type="checkbox" disabled>\n' +
                    '<input class="form__answer-label" type="text" name="answer_'+ question +'" placeholder="Respuesta...">\n' +
                    '</div>\n' +
                    '<div class="form__answer-container">\n' +
                    '<input class="form__answer" type="checkbox" disabled>\n' +
                    '<input class="form__answer-label" type="text" name="answer_'+ question +'" placeholder="Respuesta...">\n' +
                    '<div class="form__answer-delete">\n' +
                    '<svg class="poll__delete-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">\n' +
                    '<path fill="#c00" d="M507.331 411.33c-0.002-0.002-0.004-0.004-0.006-0.005l-155.322-155.325 155.322-155.325c0.002-0.002 0.004-0.003 0.006-0.005 1.672-1.673 2.881-3.627 3.656-5.708 2.123-5.688 0.912-12.341-3.662-16.915l-73.373-73.373c-4.574-4.573-11.225-5.783-16.914-3.66-2.080 0.775-4.035 1.984-5.709 3.655 0 0.002-0.002 0.003-0.004 0.005l-155.324 155.326-155.324-155.325c-0.002-0.002-0.003-0.003-0.005-0.005-1.673-1.671-3.627-2.88-5.707-3.655-5.69-2.124-12.341-0.913-16.915 3.66l-73.374 73.374c-4.574 4.574-5.784 11.226-3.661 16.914 0.776 2.080 1.985 4.036 3.656 5.708 0.002 0.001 0.003 0.003 0.005 0.005l155.325 155.324-155.325 155.326c-0.001 0.002-0.003 0.003-0.004 0.005-1.671 1.673-2.88 3.627-3.657 5.707-2.124 5.688-0.913 12.341 3.661 16.915l73.374 73.373c4.575 4.574 11.226 5.784 16.915 3.661 2.080-0.776 4.035-1.985 5.708-3.656 0.001-0.002 0.003-0.003 0.005-0.005l155.324-155.325 155.324 155.325c0.002 0.001 0.004 0.003 0.006 0.004 1.674 1.672 3.627 2.881 5.707 3.657 5.689 2.123 12.342 0.913 16.914-3.661l73.373-73.374c4.574-4.574 5.785-11.227 3.662-16.915-0.776-2.080-1.985-4.034-3.657-5.707z"></path>\n' +
                    '</svg>\n' +
                    '</div>\n' +
                    '</div>\n' +
                    '</fieldset>' +
                    '<div class="form__answer-add-container">\n' +
                    '<div class="form__answer-add-btn">' +
                    '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">\n' +
                    '<path fill="#15431F" d="M352 288v-128h-64v128h-128v64h128v128h64v-128h128v-64h-128zM320 640c-176.731 0-320-143.269-320-320s143.269-320 320-320v0c176.731 0 320 143.269 320 320s-143.269 320-320 320v0z"></path>\n' +
                    '</svg>' +
                    '</div>\n' +
                    '</div>');
            }
        }

        $('.form__question-types').hide();
    });

    /* Add cuadricule */
    $(document).on('click', '.form__answer_row-add-btn', function () {
        var fieldset = $(this).parent().prev(),
            optionHtml = '<div class="form__answer-container">\n' +
                '<div>\n'+
                '<input id="row" class="form__answer-label" type="text" name="row_'+ fieldset.parent().parent().data('question') +'" placeholder="Fila...">\n' +
                '<div class="form__answer-delete">\n' +
                '<svg class="poll__delete-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">\n' +
                '<path fill="#c00" d="M507.331 411.33c-0.002-0.002-0.004-0.004-0.006-0.005l-155.322-155.325 155.322-155.325c0.002-0.002 0.004-0.003 0.006-0.005 1.672-1.673 2.881-3.627 3.656-5.708 2.123-5.688 0.912-12.341-3.662-16.915l-73.373-73.373c-4.574-4.573-11.225-5.783-16.914-3.66-2.080 0.775-4.035 1.984-5.709 3.655 0 0.002-0.002 0.003-0.004 0.005l-155.324 155.326-155.324-155.325c-0.002-0.002-0.003-0.003-0.005-0.005-1.673-1.671-3.627-2.88-5.707-3.655-5.69-2.124-12.341-0.913-16.915 3.66l-73.374 73.374c-4.574 4.574-5.784 11.226-3.661 16.914 0.776 2.080 1.985 4.036 3.656 5.708 0.002 0.001 0.003 0.003 0.005 0.005l155.325 155.324-155.325 155.326c-0.001 0.002-0.003 0.003-0.004 0.005-1.671 1.673-2.88 3.627-3.657 5.707-2.124 5.688-0.913 12.341 3.661 16.915l73.374 73.373c4.575 4.574 11.226 5.784 16.915 3.661 2.080-0.776 4.035-1.985 5.708-3.656 0.001-0.002 0.003-0.003 0.005-0.005l155.324-155.325 155.324 155.325c0.002 0.001 0.004 0.003 0.006 0.004 1.674 1.672 3.627 2.881 5.707 3.657 5.689 2.123 12.342 0.913 16.914-3.661l73.373-73.374c4.574-4.574 5.785-11.227 3.662-16.915-0.776-2.080-1.985-4.034-3.657-5.707z"></path>\n' +
                '</svg>\n' +
                '</div>\n' +
                '</div>\n'+
                '</div>';

        fieldset.append(optionHtml);
    });

    /* Add cuadricule column*/
    $(document).on('click', '.form__answer_column-add-btn', function () {
        var fieldset = $(this).parent().prev(),
            optionHtml = '<div class="form__answer-container">\n' +
                '<div>\n'+
                '<input id="colm" class="form__answer-label" type="text" name="colm_'+ fieldset.parent().parent().data('question') +'" placeholder="Columna...">\n' +
                '<div class="form__answer-delete">\n' +
                '<svg class="poll__delete-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">\n' +
                '<path fill="#c00" d="M507.331 411.33c-0.002-0.002-0.004-0.004-0.006-0.005l-155.322-155.325 155.322-155.325c0.002-0.002 0.004-0.003 0.006-0.005 1.672-1.673 2.881-3.627 3.656-5.708 2.123-5.688 0.912-12.341-3.662-16.915l-73.373-73.373c-4.574-4.573-11.225-5.783-16.914-3.66-2.080 0.775-4.035 1.984-5.709 3.655 0 0.002-0.002 0.003-0.004 0.005l-155.324 155.326-155.324-155.325c-0.002-0.002-0.003-0.003-0.005-0.005-1.673-1.671-3.627-2.88-5.707-3.655-5.69-2.124-12.341-0.913-16.915 3.66l-73.374 73.374c-4.574 4.574-5.784 11.226-3.661 16.914 0.776 2.080 1.985 4.036 3.656 5.708 0.002 0.001 0.003 0.003 0.005 0.005l155.325 155.324-155.325 155.326c-0.001 0.002-0.003 0.003-0.004 0.005-1.671 1.673-2.88 3.627-3.657 5.707-2.124 5.688-0.913 12.341 3.661 16.915l73.374 73.373c4.575 4.574 11.226 5.784 16.915 3.661 2.080-0.776 4.035-1.985 5.708-3.656 0.001-0.002 0.003-0.003 0.005-0.005l155.324-155.325 155.324 155.325c0.002 0.001 0.004 0.003 0.006 0.004 1.674 1.672 3.627 2.881 5.707 3.657 5.689 2.123 12.342 0.913 16.914-3.661l73.373-73.374c4.574-4.574 5.785-11.227 3.662-16.915-0.776-2.080-1.985-4.034-3.657-5.707z"></path>\n' +
                '</svg>\n' +
                '</div>\n' +
                '</div>\n'+
                '</div>';

        fieldset.append(optionHtml);
    });

    /* Add Answer */
    $(document).on('click', '.form__answer-add-btn', function () {
        var fieldset = $(this).parent().prev(),
            optionHtml = '<div class="form__answer-container">\n' +
                '<input class="form__answer" type="'+ fieldset.data('type') +'" disabled>\n' +
                '<input class="form__answer-label" type="text" name="answer_'+ fieldset.parent().parent().data('question') +'" placeholder="Respuesta...">\n' +
                '<div class="form__answer-delete">\n' +
                '<svg class="poll__delete-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">\n' +
                '<path fill="#c00" d="M507.331 411.33c-0.002-0.002-0.004-0.004-0.006-0.005l-155.322-155.325 155.322-155.325c0.002-0.002 0.004-0.003 0.006-0.005 1.672-1.673 2.881-3.627 3.656-5.708 2.123-5.688 0.912-12.341-3.662-16.915l-73.373-73.373c-4.574-4.573-11.225-5.783-16.914-3.66-2.080 0.775-4.035 1.984-5.709 3.655 0 0.002-0.002 0.003-0.004 0.005l-155.324 155.326-155.324-155.325c-0.002-0.002-0.003-0.003-0.005-0.005-1.673-1.671-3.627-2.88-5.707-3.655-5.69-2.124-12.341-0.913-16.915 3.66l-73.374 73.374c-4.574 4.574-5.784 11.226-3.661 16.914 0.776 2.080 1.985 4.036 3.656 5.708 0.002 0.001 0.003 0.003 0.005 0.005l155.325 155.324-155.325 155.326c-0.001 0.002-0.003 0.003-0.004 0.005-1.671 1.673-2.88 3.627-3.657 5.707-2.124 5.688-0.913 12.341 3.661 16.915l73.374 73.373c4.575 4.574 11.226 5.784 16.915 3.661 2.080-0.776 4.035-1.985 5.708-3.656 0.001-0.002 0.003-0.003 0.005-0.005l155.324-155.325 155.324 155.325c0.002 0.001 0.004 0.003 0.006 0.004 1.674 1.672 3.627 2.881 5.707 3.657 5.689 2.123 12.342 0.913 16.914-3.661l73.373-73.374c4.574-4.574 5.785-11.227 3.662-16.915-0.776-2.080-1.985-4.034-3.657-5.707z"></path>\n' +
                '</svg>\n' +
                '</div>\n' +
                '</div>';

        fieldset.append(optionHtml);
    });

    /* Add Answer list*/
    $(document).on('click', '#form_list_answer-add-btn', function () {
        var fieldset = $(this).parent().prev(),
            optionHtml = '<div class="form__answer-container">\n' +
                '<input class="form__answer-label" type="text" name="answer_'+ fieldset.parent().parent().data('question') +'" placeholder="Respuesta...">\n' +
                '<div class="form__answer-delete">\n' +
                '<svg class="poll__delete-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">\n' +
                '<path fill="#c00" d="M507.331 411.33c-0.002-0.002-0.004-0.004-0.006-0.005l-155.322-155.325 155.322-155.325c0.002-0.002 0.004-0.003 0.006-0.005 1.672-1.673 2.881-3.627 3.656-5.708 2.123-5.688 0.912-12.341-3.662-16.915l-73.373-73.373c-4.574-4.573-11.225-5.783-16.914-3.66-2.080 0.775-4.035 1.984-5.709 3.655 0 0.002-0.002 0.003-0.004 0.005l-155.324 155.326-155.324-155.325c-0.002-0.002-0.003-0.003-0.005-0.005-1.673-1.671-3.627-2.88-5.707-3.655-5.69-2.124-12.341-0.913-16.915 3.66l-73.374 73.374c-4.574 4.574-5.784 11.226-3.661 16.914 0.776 2.080 1.985 4.036 3.656 5.708 0.002 0.001 0.003 0.003 0.005 0.005l155.325 155.324-155.325 155.326c-0.001 0.002-0.003 0.003-0.004 0.005-1.671 1.673-2.88 3.627-3.657 5.707-2.124 5.688-0.913 12.341 3.661 16.915l73.374 73.373c4.575 4.574 11.226 5.784 16.915 3.661 2.080-0.776 4.035-1.985 5.708-3.656 0.001-0.002 0.003-0.003 0.005-0.005l155.324-155.325 155.324 155.325c0.002 0.001 0.004 0.003 0.006 0.004 1.674 1.672 3.627 2.881 5.707 3.657 5.689 2.123 12.342 0.913 16.914-3.661l73.373-73.374c4.574-4.574 5.785-11.227 3.662-16.915-0.776-2.080-1.985-4.034-3.657-5.707z"></path>\n' +
                '</svg>\n' +
                '</div>\n' +
                '</div>';

        fieldset.append(optionHtml);
    });

    /* Delete answer */
    $(document).on('click', '.form__answer-delete', function () {
        var parent = $(this).parent();

        parent.remove();

        $('.form__answer-container .form__answer').each(function () {
            $(this).val('option'+ ($(this).parent().index() + 1));
        });
    });

    /* Add question */
    $('.form__poll-new-question-add-btn').on('click', function () {
        var nextQuestion = $('.form__poll-new-question').length + 1,
            questionBase = '<div class="form__poll-new-question" data-question="question_'+ nextQuestion +'">' +
                '<div class="form__edit-question-type">' +
                '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 919.8 919.8" style="enable-background:new 0 0 919.8 919.8; xml:space="preserve">' +
                '<g>' +
                '<path fill="#15431F" d="M684.833,209.4l27-33.8c37-46.2,29.5-113.7-16.801-150.7l-1.699-1.4c-46.2-37-113.7-29.5-150.7,16.8l-26.9,33.7' +
                'L684.833,209.4z"></path>' +
                '<path fill="#15431F" d="M520.532,493.5c0.9,8.199,5,16,11.9,21.6c13.9,11.1,34.2,8.9,45.3-5l185.5-232c11.3-14.1,8.8-34.8-5.7-45.8' +
                'c-14-10.6-34.1-7.6-45.1,6.1l-18.1,22.6l-31-24.8l0.1-0.1l-169-135.5l-432.4,540.5l169.1,135.4l392.1-490l31,24.8l-126.8,158.5' +
                'C521.833,476.699,519.633,485.3,520.532,493.5z"></path>' +
                '<path fill="#15431F" d="M203.032,801.5l-159.3-127.601c-2.6,8.9-3.9,16.7-3.9,16.7l-36.5,174.8c-2.6,12.601,10.2,22.9,21.9,17.5l162.6-74' +
                'C187.732,808.899,194.932,805.899,203.032,801.5z"></path>' +
                '<path fill="#15431F" d="M893.633,832.8c-1.4,0-2.7,0.1-4.101,0.3l-245.699,31.8c-12.601,1.601-21.4-12.2-14.601-23c3.7-5.7,7.3-11.5,10.9-17.3' +
                'c9.5-15.4-3.2-35.9-20.8-35.9c-1.2,0-2.4,0.101-3.7,0.301l-322,48.399l-38.5,5.8l-105,15.801c-11.9,1.8-19.9,11.899-18.9,24' +
                'c0.4,5.399,2.6,10.5,6.1,14.3c4.1,4.5,9.8,7,16,7c1.2,0,2.4-0.101,3.7-0.3l383.801-57.7c13.1-2,22.1,12.8,14.399,23.6' +
                'c-2.5,3.4-5,6.9-7.5,10.3c-6.899,9.4-5.3,25.101,2.7,33.2c4.1,4.2,9.3,6.4,14.8,6.4c0.601,0,1.3,0,1.9-0.101h0.1h0.101' +
                'l331.3-42.199h0.1h0.101c5.699-0.9,10.699-4.2,14-9.301c3.6-5.6,4.899-12.5,3.3-18.699' +
                'C913.532,839.399,904.732,832.8,893.633,832.8z"></path>' +
                '</g>' +
                '</svg>' +
                '</div>' +
                '<div class="form__delete-question">' +
                '<svg class="poll__delete-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">' +
                '<path fill="#c00" d="M507.331 411.33c-0.002-0.002-0.004-0.004-0.006-0.005l-155.322-155.325 155.322-155.325c0.002-0.002 0.004-0.003 0.006-0.005 1.672-1.673 2.881-3.627 3.656-5.708 2.123-5.688 0.912-12.341-3.662-16.915l-73.373-73.373c-4.574-4.573-11.225-5.783-16.914-3.66-2.080 0.775-4.035 1.984-5.709 3.655 0 0.002-0.002 0.003-0.004 0.005l-155.324 155.326-155.324-155.325c-0.002-0.002-0.003-0.003-0.005-0.005-1.673-1.671-3.627-2.88-5.707-3.655-5.69-2.124-12.341-0.913-16.915 3.66l-73.374 73.374c-4.574 4.574-5.784 11.226-3.661 16.914 0.776 2.080 1.985 4.036 3.656 5.708 0.002 0.001 0.003 0.003 0.005 0.005l155.325 155.324-155.325 155.326c-0.001 0.002-0.003 0.003-0.004 0.005-1.671 1.673-2.88 3.627-3.657 5.707-2.124 5.688-0.913 12.341 3.661 16.915l73.374 73.373c4.575 4.574 11.226 5.784 16.915 3.661 2.080-0.776 4.035-1.985 5.708-3.656 0.001-0.002 0.003-0.003 0.005-0.005l155.324-155.325 155.324 155.325c0.002 0.001 0.004 0.003 0.006 0.004 1.674 1.672 3.627 2.881 5.707 3.657 5.689 2.123 12.342 0.913 16.914-3.661l73.373-73.374c4.574-4.574 5.785-11.227 3.662-16.915-0.776-2.080-1.985-4.034-3.657-5.707z"></path>' +
                '</svg>' +
                '</div>' +
                '<p class="form__poll-new-question-title">' +
                'Pregunta '+ nextQuestion +
                '</p>' +
                '<input class="form__poll-new-question-type" type="checkbox" name="q_type" value="open" checked>' +
                '<textarea class="form__poll-new-question-content" name="q_content"></textarea>' +
                '<div class="form__input-answers" data-answer="open"></div>' +
                '</div>';

        $('.form__question-types').before(questionBase);
    });

    /* Delete question */
    $(document).on('click', '.form__delete-question', function () {
        $(this).parent().remove();

        $('.form__poll-new-question').each(function () {
            $(this).attr('data-question', 'question_'+ ($(this).index() + 1));
            $(this).find('.form__poll-new-question-title').html('Pregunta '+ ($(this).index() + 1));
        });
    });

    /* Save poll */
    $('.form--poll .form__submit').on('click', function () {
        var questions = [];

        if ('validated') {
            var questionLength = $('.form__input-container--poll-question:not(.form__input-container--add-question)').length;

            for (var j=1; j<=questionLength; j++) {
                var currentQJson = {},
                    currentQElem = $('.form__input-container--poll-question[data-question=question_'+ j);

                currentQJson['content'] = currentQElem.find('[name=q_content]').val();
                currentQJson['type'] = currentQElem.find('[name=q_type]').val();

                if (currentQJson['type'] !== 'open') {
                    currentQJson['answers'] = [];
                    currentQElem.find('.form__input-answers[data-answer='+currentQJson['type']+']').find('.form__answer-label').each(function () {
                        currentQJson['answers'].push($(this).val());
                    });
                }else if(currentQJson['type'] === 'cuad'){
                    currentQJson['row'] = [];
                    currentQJson['colm'] = [];
                    currentQElem.find('.form__input-answers[data-answer='+currentQJson['type']+']').find('#colm').each(function () {
                        currentQJson['answers'].push($(this).val());
                    });
                    currentQElem.find('.form__input-answers[data-answer='+currentQJson['type']+']').find('#row').each(function () {
                        currentQJson['answers'].push($(this).val());
                    });
                }
                questions.push(currentQJson);
            }
        }

        // $.ajax({
        //     type: "POST",
        //     contentType: "application/json;charset=utf-8",
        //     url: "/crear-encuesta",
        //     traditional: "true",
        //     data: JSON.stringify({'title': $('.form__input-box--post-title').val(), 'questions': questions}),
        //     dataType: "json"
        // });
        console.log(questions);
    });

    /* Add users */
    $('.form__add-users-btn').on('click', function () {
        var base = '<div class="form__add-users-container">\n' +
            '<input class="form__add-users-input" type="text" name="name" required placeholder="Nombre completo">\n' +
            '<input class="form__add-users-input" type="email" name="email" required placeholder="Email">\n' +
            '<input class="form__add-users-input" type="number" name="id" required placeholder="Cédula">\n' +
            '<div class="form__add-users-delete form__add-users-delete--btn">\n' +
            '<svg class="poll__delete-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">\n' +
            '<path fill="#c00" d="M507.331 411.33c-0.002-0.002-0.004-0.004-0.006-0.005l-155.322-155.325 155.322-155.325c0.002-0.002 0.004-0.003 0.006-0.005 1.672-1.673 2.881-3.627 3.656-5.708 2.123-5.688 0.912-12.341-3.662-16.915l-73.373-73.373c-4.574-4.573-11.225-5.783-16.914-3.66-2.080 0.775-4.035 1.984-5.709 3.655 0 0.002-0.002 0.003-0.004 0.005l-155.324 155.326-155.324-155.325c-0.002-0.002-0.003-0.003-0.005-0.005-1.673-1.671-3.627-2.88-5.707-3.655-5.69-2.124-12.341-0.913-16.915 3.66l-73.374 73.374c-4.574 4.574-5.784 11.226-3.661 16.914 0.776 2.080 1.985 4.036 3.656 5.708 0.002 0.001 0.003 0.003 0.005 0.005l155.325 155.324-155.325 155.326c-0.001 0.002-0.003 0.003-0.004 0.005-1.671 1.673-2.88 3.627-3.657 5.707-2.124 5.688-0.913 12.341 3.661 16.915l73.374 73.373c4.575 4.574 11.226 5.784 16.915 3.661 2.080-0.776 4.035-1.985 5.708-3.656 0.001-0.002 0.003-0.003 0.005-0.005l155.324-155.325 155.324 155.325c0.002 0.001 0.004 0.003 0.006 0.004 1.674 1.672 3.627 2.881 5.707 3.657 5.689 2.123 12.342 0.913 16.914-3.661l73.373-73.374c4.574-4.574 5.785-11.227 3.662-16.915-0.776-2.080-1.985-4.034-3.657-5.707z"></path>\n' +
            '</svg>\n' +
            '</div>\n' +
            '</div>';

        $(this).parent().before(base);
    });

    /* Remove users from form */
    $(document).on('click', '.form__add-users-delete--btn', function () {
        $(this).parent().remove();
    });
});

function confirm_submit(submit) {
    if (submit === 'Publicar') {
        if ($('.container').data('container') === 'add-post' || $('.container').data('container') === 'edit-post') {
            if ($('#title').val() && $('#content').val()) {
                if (confirm('¿Seguro que desea publicar?')) {
                    $('.loading-screen').show();
                    return true;
                }
            }
            else {
                alert('Favor de llenar todos los campos.');
            }
        }
        else {
            var valid = true;

            if (!$('#title').val()) {
                valid = false;
            }

            if ($('.form__poll-new-question-content').length === 0) {
                valid = false;
                alert("No puede publicar encuestas sin preguntas.");
                return false;
            }
            else {
                $('.form__poll-new-question-content').each(function () {
                    if ($(this).val() === "") {
                        valid = false;
                    }
                });

                $('.form__answer-label').each(function () {
                    if (!$(this).val()) {
                        valid = false;
                    }
                });
            }

            if (valid) {
                if (confirm('¿Seguro que desea publicar?')) {
                    $('.loading-screen').show();
                    return true;
                }
            }
            else {
                alert('Favor de llenar todos los campos.');
                return false;
            }
        }
    }
    else if (submit === 'Guardar') {
        if ($('#title').val()) {
            if (confirm('¿Seguro que desea guardar los cambios sin publicar?')) {
                $('.loading-screen').show();
                return true;
            }
        }
        else {
            alert('Favor de ingresar un título.');
        }
    }
    else if (submit === 'Agregar') {
        if (confirm('¿Seguro que desea agregar a estos usuarios?')) {
            $('.loading-screen').show();
            return true;
        }
    }
    else if (submit === 'Eliminar') {
        if (confirm('¿Seguro que desea eliminar a este usuario?')) {
            $('.loading-screen').show();
            return true;
        }
    }
    else if (submit === 'Cancelar') {
        return confirm('¿Seguro que desea cancelar los cambios realizados?');
    }
    else if (submit === 'Back') {
        return confirm('¿Seguro que desea regresar sin antes guardar los cambios?');
    }
    else if (submit === 'Delete poll') {
        if (confirm('¿Seguro que desea eliminar esta encuesta?')) {
            $('.loading-screen').show();
            return true;
        }
    }
    else if (submit === 'Copy poll') {
        if (confirm('¿Seguro que desea copiar esta encuesta?')) {
            $('.loading-screen').show();
            return true;
        }
    }
    else if (submit === 'Delete post') {
        if (confirm('¿Seguro que desea eliminar esta noticia?')) {
            $('.loading-screen').show();
            return true;
        }
    }
    else if (submit === 'Logout') {
        return confirm('¿Seguro que desea cerrar sesión?');
    }
    return false;
}

function isMobile() {
    if (/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent)) {
        return true;
    }
}

function videoResize() {
    var width,
        height;

    if ($('.container').data('container') === 'view-post') {
        width = $('.form__post-image-container--view').width();
        height = width * 0.6;
    }
    else if ($('.container').data('container') === 'edit-post') {
        width = $('.form__post-image').width();
        height = width * 0.6;
    }
    else if ($('.container').data('container') === 'add-post') {
        width = $('.form__post-image-container').width();
        height = width * 0.6;
    }

    $('#video').width(width)
        .height(height);
}
