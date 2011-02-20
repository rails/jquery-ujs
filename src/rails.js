/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.4.3 or later.
 * https://github.com/rails/jquery-ujs
 */

(function($) {
	// Make sure that every Ajax request sends the CSRF token
	function CSRFProtection(fn) {
		var token = $('meta[name="csrf-token"]').attr('content');
		if (token) fn(function(xhr) { xhr.setRequestHeader('X-CSRF-Token', token) });
	}
	if ($().jquery == '1.5') { // gruesome hack
		var factory = $.ajaxSettings.xhr;
		$.ajaxSettings.xhr = function() {
			var xhr = factory();
			CSRFProtection(function(setHeader) {
				var open = xhr.open;
				xhr.open = function() { open.apply(this, arguments); setHeader(this) };
			});
			return xhr;
		};
	}
	else $(document).ajaxSend(function(e, xhr) {
		CSRFProtection(function(setHeader) { setHeader(xhr) });
	});

	// Triggers an event on an element and returns the event result
	function fire(obj, name, data) {
		var event = $.Event(name);
		obj.trigger(event, data);
		return event.result !== false;
	}

	// Submits "remote" forms and links with ajax
	function handleRemote(element, event) {
		var method, url, data,
			dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

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
                event.preventDefault();
	}

	// Handles "data-method" on links such as:
	// <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
	function handleMethod(link, event) {
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
                event.preventDefault();
	}

	function disableFormElements(form) {
          form.find('input[data-disable-with]').attr('disabled', 'disabled').val(function(index, value) {
            return $(this).data('ujs:enable-with', value).data('disable-with');
          });
	}

	function enableFormElements(form) {
          form.find('input[data-disable-with]').removeAttr('disabled').val(function() {
            return $(this).data('ujs:enable-with');
          });
	}

	function allowAction(element) {
		var message = element.data('confirm');
		return !message || (fire(element, 'confirm') && confirm(message));
	}

        function register(button) {
                var name = button.attr('name'), data = name ? {name:name, value:button.val()} : null;
                button.closest('form').data('ujs:submit-button', data);
        }

        function isMissing() {
          return !$(this).val();
        }

        $.fn.on = function(name, fn) {
          return $(this).live(name + '.rails', fn);
        }

        $.fn.ifTargetOn = function(name, fn) {
          return $(this).on('ajax:' + name, function(event) {
            if (this == event.target) fn($(this));
          });
        }

        $.fn.ifAllowedOn = function(name, fn) {
          $(this).on(name, function(event) {
            var element = $(this);
            allowAction(element) ? fn(element, event) : event.preventDefault();
          });
        }

	$('a[data-remote]').ifAllowedOn('click', handleRemote);
	$('a[data-method]:not([data-remote])').ifAllowedOn('click', handleMethod);

	$('form[data-remote]').ifAllowedOn('submit', function(form, event) {
          form.find('input[required]').filter(isMissing).length > 0 ? event.preventDefault() : handleRemote(form, event);
	});

	$('form:not([data-remote])').ifAllowedOn('submit', function(form, event) {
                // slight timeout so that the submit button gets properly serialized
                setTimeout(function(){ disableFormElements(form) }, 13);
	});

	$('form input[type=submit], form button[type=submit], form button:not([type])').ifAllowedOn('click', register)
	$('form').ifTargetOn('beforeSend', disableFormElements).ifTargetOn('complete', enableFormElements);
})( jQuery );
