(function(){

function build_form(attrs) {
  attrs = $.extend({ action: '/echo', 'data-remote': 'true' }, attrs);

  $('#fixtures').append($('<form />', attrs));

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

test('form method is read from "method" and not from "data-method"', function() {
  expect(2);
  build_form({ method: 'post', 'data-method': 'get' });
  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      App.assert_post_request(data.request_env); 
      start();
    })
    .trigger('submit');
});

test('form method is not read from "data-method" attribute in case of missing "method"', function() {
  expect(2);
  build_form({ 'data-method': 'put' });
  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      App.assert_post_request(data.request_env); 

      start();
    })
    .trigger('submit');
});

test('form default method is POST', function() {
  expect(2);
  build_form();
  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      App.assert_post_request(data.request_env); 
      start();
    })
    .trigger('submit');
});

test('form url is picked up from "action"', function() {
  expect(2);
  build_form();
  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      App.assert_request_path(data.request_env, '/echo');
      start();
    })
    .trigger('submit');
});

test('form url is read from "action" not "href"', function() {
  expect(2);
  build_form({ href: '/echo2' });
  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      App.assert_request_path(data.request_env, '/echo');
      start();
    })
    .trigger('submit');
});

test('data should be availabe in JSON format if data-type is json', function() {
  expect(2);
  build_form({
    'method': 'post',
    'data-method': 'get',
    'data-type': 'json'
  });
  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      App.assert_post_request(data.request_env); 
      start();
    })
    .trigger('submit');
});

})();
