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

function submit(fn) {
  stop(App.ajax_timeout);

  $('form[data-remote]')
    .live('ajax:success', fn)
    .live('ajax:complete', function() { start() })
    .trigger('submit');
}

test('form method is read from "method" and not from "data-method"', function() {
  expect(1);
  build_form({ method: 'post', 'data-method': 'get' });

  submit(function(e, data, status, xhr) {
    App.assert_post_request(data.request_env);
  });
});

test('form method is not read from "data-method" attribute in case of missing "method"', function() {
  expect(1);
  build_form({ 'data-method': 'put' });

  submit(function(e, data, status, xhr) {
    App.assert_post_request(data.request_env);
  });
});

test('form default method is POST', function() {
  expect(1);
  build_form();

  submit(function(e, data, status, xhr) {
    App.assert_post_request(data.request_env);
  });
});

test('form url is picked up from "action"', function() {
  expect(1);
  build_form({ method: 'post' });

  submit(function(e, data, status, xhr) {
    App.assert_request_path(data.request_env, '/echo');
  });
});

test('form url is read from "action" not "href"', function() {
  expect(1);
  build_form({ method: 'post', href: '/echo2' });

  submit(function(e, data, status, xhr) {
    App.assert_request_path(data.request_env, '/echo');
  });
});

test('prefer JS, but accept any format', function() {
  expect(1);
  build_form({ method: 'post' });

  submit(function(e, data, status, xhr) {
    var accept = data.request_env['HTTP_ACCEPT'];
    // HACK to normalize header sent by jQuery 1.4.4 and below:
    accept = accept.replace('*/*, */*', '*/*');
    equals(accept, '*/*;q=0.5, text/javascript, application/javascript');
  });
});

test('accept application/json if "data-type" is json', function() {
  expect(1);
  build_form({ method: 'post', 'data-type': 'json' });

  submit(function(e, data, status, xhr) {
    equals(data.request_env['HTTP_ACCEPT'], 'application/json, text/javascript, */*; q=0.01');
  });
});

})();
