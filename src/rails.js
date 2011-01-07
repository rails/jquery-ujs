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

	/**
	 * confirmation handler
	 */
	$('a[data-confirm], button[data-confirm], input[data-confirm]').live('click.rails', function() {
		var el = $(this);
		if (fire(el, 'confirm')) {
			if (!confirm(el.attr('data-confirm'))) {
				return false;
			}
		}
	});

	/**
	 * remote handlers
	 */
	$('form[data-remote]').live('submit.rails', function(e) {
		handleRemote($(this));
		e.preventDefault();
	});

	$('a[data-remote],input[data-remote]').live('click.rails', function(e) {
		handleRemote($(this));
		e.preventDefault();
	});

	/**
	 * <%= link_to "Delete", user_path(@user), :method => :delete, :confirm => "Are you sure?" %>
	 *
	 * <a href="/users/5" data-confirm="Are you sure?" data-method="delete" rel="nofollow">Delete</a>
	 */
	$('a[data-method]:not([data-remote])').live('click.rails', function(e) {
		var link = $(this),
			href = link.attr('href'),
			method = link.attr('data-method'),
			csrf_token = $('meta[name=csrf-token]').attr('content'),
			csrf_param = $('meta[name=csrf-param]').attr('content'),
			form = $('<form method="post" action="' + href + '"></form>'),
			metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

		if (csrf_param !== undefined && csrf_token !== undefined) {
			metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
		}

		form.hide().append(metadata_input).appendTo('body');

		e.preventDefault();
		form.submit();
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
