/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.4.3 or later.
 * https://github.com/rails/jquery-ujs
 */

(function($) {
	// Triggers an event on an element and returns the event result
	function fire(obj, name, data) {
		var event = new $.Event(name);
		obj.trigger(event, data);
		return event.result !== false;
	}

	// Submits "remote" forms and links with ajax
	function handleRemote(element) {
		var method, url, data,
			dataType = element.attr('data-type') || ($.ajaxSettings && $.ajaxSettings.dataType);

		if (element.is('form')) {
			method = element.attr('method') || 'POST';
			url = element.attr('action');
			data = element.serializeArray();
			// memoized value from clicked submit button
			var button = element.data('ujs:submit-button');
			if (button) data.push(button);
		} else {
			method = element.attr('data-method') || 'GET';
			url = element.attr('href');
			data = null;
		}

		$.ajax({
			url: url, type: method, data: data, dataType: dataType,
			// stopping the "ajax:beforeSend" event will cancel the ajax request
			beforeSend: function(xhr) {
				return fire(element, 'ajax:beforeSend', xhr);
			},
			success: function(data, status, xhr) {
				element.trigger('ajax:success', [data, status, xhr]);
			},
			complete: function(xhr) {
				element.trigger('ajax:complete', xhr);
			},
			error: function(xhr, status, error) {
				element.trigger('ajax:error', [xhr, status, error]);
			}
		});
	}

	// Handles "data-method" on links such as:
	// <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
	function handleMethod(link) {
		var href = link.attr('href'),
			method = link.attr('data-method'),
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

	function allowAction(element) {
		var message = element.attr('data-confirm');
		return !message || (fire(element, 'confirm') && confirm(message));
	}

	$('a[data-confirm], a[data-method], a[data-remote]').live('click.rails', function(e) {
		var link = $(this);
		if (!allowAction(link)) return false;

		if (link.attr('data-remote')) {
			handleRemote(link);
			return false;
		} else if (link.attr('data-method')) {
			handleMethod(link);
			return false;
		}
	});

	$('form').live('submit.rails', function(e) {
		var form = $(this);
		if (!allowAction(form)) return false;

		if (form.attr('data-remote')) {
			handleRemote(form);
			return false;
		}
	});

	$('form input[type=submit], form button[type=submit], form button:not([type])').live('click', function() {
		var button = $(this);
		if (!allowAction(button)) return false;
		// register the pressed submit button
		var name = button.attr('name'), data = name ? {name:name, value:button.val()} : null;
		button.closest('form').data('ujs:submit-button', data);
	});

	/**
	 * disable-with handlers
	 */
	var disable_with_input_selector = 'input[data-disable-with]',
		disable_with_form_remote_selector = 'form[data-remote]:has(' + disable_with_input_selector + ')',
		disable_with_form_not_remote_selector = 'form:not([data-remote]):has(' + disable_with_input_selector + ')';

	var disable_with_input_function = function() {
		$(this).find(disable_with_input_selector).each(function() {
			var input = $(this);
			input.data('enable-with', input.val())
				.attr('value', input.attr('data-disable-with'))
				.attr('disabled', 'disabled');
		});
	};

	$(disable_with_form_remote_selector).live('ajax:before.rails', disable_with_input_function);
	$(disable_with_form_not_remote_selector).live('submit.rails', disable_with_input_function);

	$(disable_with_form_remote_selector).live('ajax:complete.rails', function() {
		$(this).find(disable_with_input_selector).each(function() {
			var input = $(this);
			input.removeAttr('disabled').val(input.data('enable-with'));
		});
	});
})( jQuery );
