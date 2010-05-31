var App = App || {};

App.build_form = function(opt) {

	var defaults = {
		'data-remote': 'true'
	};

	var options = $.extend(defaults, opt);

	$('#fixtures').append($('<form />', options));

	$('#fixtures form').append($('<input />', {
		id: 'user_name',
		type: 'text',
		size: '30',
		'name': 'user_name',
		'value': 'john'
	}));
};

module('call-remote', {
  teardown: App.teardown
});

test('method should be picked up from method attribute and not from data-method', function() {
  expect(2);
  App.build_form({
    'method': 'post',
    'data-method': 'get',
    'action': App.url('update')
  });
  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      var request_env = $.parseJSON(data)['request_env'];
      App.assert_post_request(request_env); 

      start();
    })
    .trigger('submit');
});

test('method should be picked up from data-method attribute if method is missing', function() {
  expect(2);

  App.build_form({
    'data-method': 'post',
    'action': App.url('update')
  });

  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      var request_env = $.parseJSON(data)['request_env'];
      App.assert_post_request(request_env); 

      start();
    })
    .trigger('submit');
});

test('default method GET should be picked up if no method or data-method is supplied', function() {
  expect(2);

  App.build_form({
    action: App.url('show')
  });

  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      var request_env = $.parseJSON(data)['request_env'];
      App.assert_get_request(request_env); 

      start();
    })
    .trigger('submit');
});

test('url should be picked up from action', function() {
  expect(2);

  App.build_form({
    'action': App.url('show')
  });

  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      var request_env = $.parseJSON(data)['request_env'];
      App.assert_request_path(request_env, '/show');

      start();
    })
    .trigger('submit');
});

test('url should be picked up from action if both action and href are mentioned ', function() {
  expect(2);

  App.build_form({
    'action': App.url('show'),
    'href': 'http://example.org'
  });
  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      var request_env = $.parseJSON(data)['request_env'];
      App.assert_request_path(request_env, '/show');

      start();
    })
    .trigger('submit');
});

test('url should be picked up from href if no action is provided', function() {
  expect(2);

  App.build_form({
    'href': App.url('show')
  });
  stop(App.ajax_timeout);


  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      var request_env = $.parseJSON(data)['request_env'];
      App.assert_request_path(request_env, '/show');

      start();
    })
    .trigger('submit');
});

test('exception should be thrown if both action and url are missing', function() {
  expect(1);
  var exception_was_raised = false;

  App.build_form({});

  try {
    $('form[data-remote]').trigger('submit');
  } catch(err) {
    exception_was_raised = true;
  }

  ok(exception_was_raised, 'exception should have been raised');
});

test('data should be availabe in JSON format if datat-type is json', function() {
  expect(2);
  App.build_form({
    'method': 'post',
    'data-method': 'get',
    'data-type': 'json',
    'action': App.url('update')
  });
  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      var request_env = data['request_env'];
      App.assert_post_request(request_env); 

      start();
    })
    .trigger('submit');
});
