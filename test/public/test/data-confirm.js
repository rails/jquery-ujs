module('data-confirm', {

  teardown: App.teardown,

	setup: function() {

		$('#fixtures').append($('<a />', {
			href: App.url('show'),
			'data-remote': 'true',
			'data-confirm': 'Are you absolutely sure?',
			text: 'my social security number'
		}));

		$('#fixtures').append($('<input />', {
			'data-confirm': App.confirmation_message,
			'data-remote': 'true',
			href: App.url('show'),
			name: 'submit',
			type: 'submit',
			value: 'Click me'
		}));

	}
});

test('clicking on a link with data-confirm attribute. Confirm yes.', function() {
	expect(4);
  stop();

	window.confirm = function(msg) {
		$(document.body).data('confirmation-message', msg);
		return true;
	};

	$('a[data-confirm]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      var request_env = $.parseJSON(data)['request_env'];
      App.assert_request_path(request_env, '/show');
      App.assert_get_request(request_env); 
    })
    .trigger('click');

	setTimeout(function() { 
    start(); 
    equals( $(document.body).data('confirmation-message'), 
            App.confirmation_message, 
            'confirmation message should be same');
  }, App.ajax_timeout);

});

test('clicking on a link with data-confirm attribute. Confirm No.', function() {
	expect(1);
  stop();

	window.confirm = function(msg) {
		$(document.body).data('confirmation-message', msg);
		return false;
	};

	$('a[data-confirm]')
    .live('ajax:before', function(e, data, status, xhr) { 
      App.assert_callback_not_invoked('ajax:before');
    })
    .trigger('click');

	setTimeout(function() { 
    start(); 
	  equals( $(document.body).data('confirmation-message'), 
            App.confirmation_message, 
            'confirmation message should be same');
  }, App.ajax_timeout);

});

test('clicking on Submit input tag with data-confirm attribute. Confirm yes.', function() {
	expect(4);
  stop();

	window.confirm = function(msg) {
		$(document.body).data('confirmation-message', msg);
		return true;
	};

	$('input[data-confirm]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      var request_env = $.parseJSON(data)['request_env'];
      App.assert_request_path(request_env, '/show');
      App.assert_get_request(request_env); 
    })
    .trigger('click');

	setTimeout(function() { 
    start(); 
    equals( $(document.body).data('confirmation-message'), 
            App.confirmation_message, 
            'confirmation message should be same');
  }, App.ajax_timeout);

});

test('clicking on Submit input tag with data-confirm attribute. Confirm no.', function() {
	expect(0);
  stop();

	window.confirm = function(msg) {
		$(document.body).data('confirmation-message', msg);
		return false;
	};

	$('input[data-confirm]')
    .live('ajax:before', function(e, data, status, xhr) { 
      App.assert_callback_not_invoked('ajax:before');
    })
    .trigger('click');

	setTimeout(function() { 
    start(); 
	  equals( $(document.body).data('confirmation-message'), 
            App.confirmation_message, 
            'confirmation message should be same');
  }, App.ajax_timeout);

});
