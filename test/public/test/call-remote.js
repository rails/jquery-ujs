(function(){

function build_form(attrs) {
  attrs = $.extend({ action: '/echo', 'data-remote': 'true' }, attrs);

  $('#qunit-fixture').append($('<form />', attrs))
    .find('form').append($('<input type="text" name="user_name" value="john">'));
};

module('call-remote');

function submit(fn) {
  $('form')
    .bind('ajax:success', fn)
    .bind('ajax:complete', function() { start() })
    .trigger('submit');
}

asyncTest('form method is read from "method" and not from "data-method"', 1, function() {
  build_form({ method: 'post', 'data-method': 'get' });

  submit(function(e, data, status, xhr) {
    App.assert_post_request(data);
  });
});

asyncTest('form method is not read from "data-method" attribute in case of missing "method"', 1, function() {
  build_form({ 'data-method': 'put' });

  submit(function(e, data, status, xhr) {
    App.assert_get_request(data);
  });
});

asyncTest('form default method is GET', 1, function() {
  build_form();

  submit(function(e, data, status, xhr) {
    App.assert_get_request(data);
  });
});

asyncTest('form url is picked up from "action"', 1, function() {
  build_form({ method: 'post' });

  submit(function(e, data, status, xhr) {
    App.assert_request_path(data, '/echo');
  });
});

asyncTest('form url is read from "action" not "href"', 1, function() {
  build_form({ method: 'post', href: '/echo2' });

  submit(function(e, data, status, xhr) {
    App.assert_request_path(data, '/echo');
  });
});

asyncTest('prefer JS, but accept any format', 1, function() {
  build_form({ method: 'post' });

  submit(function(e, data, status, xhr) {
    var accept = data.HTTP_ACCEPT;
    ok(accept.indexOf('*/*;q=0.5, text/javascript, application/javascript') === 0, 'Accept: ' + accept);
  });
});

asyncTest('accept application/json if "data-type" is json', 1, function() {
  build_form({ method: 'post', 'data-type': 'json' });

  submit(function(e, data, status, xhr) {
    equal(data.HTTP_ACCEPT, 'application/json, text/javascript, */*; q=0.01');
  });
});

asyncTest('allow empty "data-remote" attribute', 1, function() {
  var form = $('#qunit-fixture').append($('<form action="/echo" data-remote />')).find('form');
  
  submit(function() {
    ok(true, 'form with empty "data-remote" attribute is also allowed');
  });
});

asyncTest('allow empty form "action"', 1, function() {
  var currentLocation, ajaxLocation;

  build_form({ action: '' });

  $('#qunit-fixture').find('form')
    .bind('ajax:beforeSend', function(e, xhr, settings) {
      // Get current location (the same way jQuery does)
      try {
        currentLocation = location.href;
      } catch(e) {
        currentLocation = document.createElement( "a" );
        currentLocation.href = "";
        currentLocation = currentLocation.href;
      }
      currentLocation = currentLocation.replace(/\?$/, '');

      // Actual location (strip out settings.data that jQuery serializes and appends)
      // HACK: can no longer use settings.data below to see what was appended to URL, as of
      // jQuery 1.6.3 (see http://bugs.jquery.com/ticket/10202 and https://github.com/jquery/jquery/pull/544)
      ajaxLocation = settings.url.replace("user_name=john","").replace(/&$/, "").replace(/\?$/, "");
      equal(ajaxLocation.match(/^(.*)/)[1], currentLocation, 'URL should be current page by default');

      // Prevent the request from actually getting sent to the current page and
      // causing an error.
      return false;
    })
    .trigger('submit');

  setTimeout(function() { start(); }, 13);
});

asyncTest('sends CSRF token in custom header', 1, function() {
  build_form({ method: 'post' });
  $('#qunit-fixture').append('<meta name="csrf-token" content="cf50faa3fe97702ca1ae" />');

  submit(function(e, data, status, xhr) {
    equal(data.HTTP_X_CSRF_TOKEN, 'cf50faa3fe97702ca1ae', 'X-CSRF-Token header should be sent');
  });
});

asyncTest('does not send CSRF token in custom header if crossDomain', 1, function() {
  build_form({ 'data-cross-domain': 'true' });
  $('#qunit-fixture').append('<meta name="csrf-token" content="cf50faa3fe97702ca1ae" />');

  // Manually set request header to be XHR, since setting crossDomain: true in .ajax()
  // causes jQuery to skip setting the request header, to prevent our test/server.rb from
  // raising an an error (when request.xhr? is false).
  $('#qunit-fixture').find('form').bind('ajax:beforeSend', function(e, xhr) {
    xhr.setRequestHeader('X-Requested-With', "XMLHttpRequest");
  });

  submit(function(e, data, status, xhr) {
    equal(data.HTTP_X_CSRF_TOKEN, undefined, 'X-CSRF-Token header should NOT be sent');
  });
});

asyncTest('intelligently guesses crossDomain behavior when target URL is a different domain', 1, function(e, xhr) {

  // Don't set data-cross-domain here, just set action to be a different domain than localhost
  build_form({ action: 'http://www.alfajango.com' });
  $('#qunit-fixture').append('<meta name="csrf-token" content="cf50faa3fe97702ca1ae" />');

  $('#qunit-fixture').find('form')
    .bind('ajax:beforeSend', function(e, xhr, settings) {

      equal(settings.crossDomain, true, 'crossDomain should be set to true');

      // prevent request from actually getting sent off-domain
      return false;
    })
    .trigger('submit');

  setTimeout(function() { start(); }, 13);
});

})();
