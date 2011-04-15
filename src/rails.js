/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.4.3 or later.
 * https://github.com/rails/jquery-ujs

 * Uploading file using rails.js
 *
 * By default, browsers do not allow files to be uploaded via AJAX. As a result, if there are any non-blank file fields
 * in the remote form, this adapter aborts the AJAX submission and allows the browser to submit the form normally.
 * You may intercept the form submission and implement your own work-around for submitting file uploads without refreshing the page,
 * by binding a handler function that returns false to the `ajax:aborted:file` hook.
 *
 * Ex:
 *     $('form').live('ajax:aborted:file', function(){
 *       // Implement own remote file-transfer handler here.
 *       return false;
 *     });
 *
 * The `ajax:aborted:file` event is fired when a form is submitted and both conditions are met:
 *   a) file-type input field is detected, and
 *   b) the value of the input:file field is not blank.
 *
 * Third-party tools can use this hook to detect when an AJAX file upload is attempted, and then use techniques like the iframe method to upload the file instead.
 *
 * Similarly, rails.js aborts AJAX form submissions if any non-blank input[required] fields are detected, providing the `ajax:aborted:required` hook.
 * Unlike file uploads, however, blank required input fields cancel the whole form submission by default.
 *
 * The default behavior for aborting the remote form submission when required inputs are missing may be canceled (thereby submitting the form via AJAX anyway)
 * by binding a handler function that returns false to the `ajax:aborted:required` hook.
 *
 * Ex:
 *     $('form').live('ajax:aborted:required', function(){
 *       return ! confirm("Would you like to submit the form with missing info?");
 *     });
 */

(function($) {
	// Make sure that every Ajax request sends the CSRF token
	function CSRFProtection(xhr) {
		var token = $('meta[name="csrf-token"]').attr('content');
		if (token) xhr.setRequestHeader('X-CSRF-Token', token);
	}
	if ('ajaxPrefilter' in $) {
		$.ajaxPrefilter(function(options, originalOptions, xhr){ CSRFProtection(xhr); });
	} else {
		$(document).ajaxSend(function(e, xhr){ CSRFProtection(xhr); });
	}

	// Triggers an event on an element and returns the event result
	function fire(obj, name, data) {
		var event = $.Event(name);
		obj.trigger(event, data);
		return event.result !== false;
	}

	// Submits "remote" forms and links with ajax
	function handleRemote(element) {
		var method, url, data,
			dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

	if (fire(element, 'ajax:before')) {
		if (element.is('form')) {
			method = element.attr('method');
			url = element.attr('action');
			data = element.serializeArray();
			// memoized value from clicked submit button
			var button = element.data('ujs:submit-button');
			if (button) {
				data.push(button);
				element.data('ujs:submit-button', null);
			}
		} else {
			method = element.data('method');
			url = element.attr('href');
			data = null;
		}
			$.ajax({
				url: url, type: method || 'GET', data: data, dataType: dataType,
				// stopping the "ajax:beforeSend" event will cancel the ajax request
				beforeSend: function(xhr, settings) {
					if (settings.dataType === undefined) {
						xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
					}
					return fire(element, 'ajax:beforeSend', [xhr, settings]);
				},
				success: function(data, status, xhr) {
					element.trigger('ajax:success', [data, status, xhr]);
				},
				complete: function(xhr, status) {
					element.trigger('ajax:complete', [xhr, status]);
				},
				error: function(xhr, status, error) {
					element.trigger('ajax:error', [xhr, status, error]);
				}
			});
		}
	}

	// Handles "data-method" on links such as:
	// <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
	function handleMethod(link) {
		var href = link.attr('href'),
			method = link.data('method'),
			csrf_token = $('meta[name=csrf-token]').attr('content'),
			csrf_param = $('meta[name=csrf-param]').attr('content'),
			form = $('<form method="post" action="' + href + '"></form>'),
			metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

		if (csrf_param !== undefined && csrf_token !== undefined) {
			metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
		}

		form.hide().append(metadata_input).appendTo('body');
		form.submit();
	}

	function disableFormElements(form) {
		form.find('input[data-disable-with], button[data-disable-with]').each(function() {
			var element = $(this), method = element.is('button') ? 'html' : 'val';
			element.data('ujs:enable-with', element[method]());
			element[method](element.data('disable-with'));
			element.attr('disabled', 'disabled');
		});
	}

	function enableFormElements(form) {
		form.find('input[data-disable-with]:disabled, button[data-disable-with]:disabled').each(function() {
			var element = $(this), method = element.is('button') ? 'html' : 'val';
			if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
			element.removeAttr('disabled');
		});
	}

	function allowAction(element) {
		var message = element.data('confirm');
		return !message || (fire(element, 'confirm') && confirm(message));
	}

	function blankInputs(form, specifiedSelector) {
		var blankExists = false,
				selector = specifiedSelector || 'input';
		form.find(selector).each(function() {
			if (!$(this).val()) blankExists = true;
		});
		return blankExists;
	}

	function nonBlankInputs(form, specifiedSelector) {
		var nonBlankExists = false,
				selector = specifiedSelector || 'input';
		form.find(selector).each(function() {
			if ($(this).val()) nonBlankExists = true;
		});
		return nonBlankExists;
	}

  function stopEverything(e) {
    e.stopImmediatePropagation();
    return false;
  }

  function callFormSubmitBindings(form) {
    var events = form.data('events'), continuePropagation = true;
    if (events != undefined && events['submit'] != undefined) {
      $.each(events['submit'], function(i, obj){
        if (typeof obj.handler === 'function') return continuePropagation = obj.handler(obj.data);
      })
    }
    return continuePropagation;
  }

	$('a[data-confirm], a[data-method], a[data-remote]').live('click.rails', function(e) {
		var link = $(this);
		if (!allowAction(link)) return stopEverything(e);

		if (link.data('remote') != undefined) {
			handleRemote(link);
			return false;
		} else if (link.data('method')) {
			handleMethod(link);
			return false;
		}
	});

	$('form').live('submit.rails', function(e) {
		var form = $(this), remote = form.data('remote') != undefined;
		if (!allowAction(form)) return stopEverything(e);

		// skip other logic when required values are missing or file upload is present
		if (blankInputs(form, 'input[name][required]') && fire(form, 'ajax:aborted:required')) {
			return !remote;
		}
		if (nonBlankInputs(form, 'input:file')) {
			return fire(form, 'ajax:aborted:file');
		}

    // If browser does not support submit bubbling, then this live-binding will be called before direct
    // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
    if (!$.support.submitBubbles && callFormSubmitBindings(form) == false) return stopEverything(e)

		if (remote) {
			handleRemote(form);
			return false;
		} else {
			// slight timeout so that the submit button gets properly serialized
			setTimeout(function(){ disableFormElements(form); }, 13);
		}
	});

	$('form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])').live('click.rails', function() {
		var button = $(this);
		if (!allowAction(button)) return stopEverything(e);
		// register the pressed submit button
		var name = button.attr('name'), data = name ? {name:name, value:button.val()} : null;
		button.closest('form').data('ujs:submit-button', data);
	});

	$('form').live('ajax:beforeSend.rails', function(event) {
		if (this == event.target) disableFormElements($(this));
	});

	$('form').live('ajax:complete.rails', function(event) {
		if (this == event.target) enableFormElements($(this));
	});
})( jQuery );
