(function(){

module('data-method', {
  setup: function() {
    $('#qunit-fixture').append($('<a />', {
      href: '/echo', 'data-method': 'delete', text: 'destroy!'
    }));
  },
  teardown: function() {
    $(document).unbind('iframe:loaded');
  }
});

function submit(fn, options) {
  $(document).bind('iframe:loaded', function(e, data) {
    fn(data);
    start();
  });

  $('#qunit-fixture').find('a')
    .trigger('click');
}

asyncTest('link with "data-method" set to "delete"', 3, function() {
  submit(function(data) {
    equal(data.REQUEST_METHOD, 'DELETE');
    strictEqual(data.params.authenticity_token, undefined);
    strictEqual(data.HTTP_X_CSRF_TOKEN, undefined);
  });
});

asyncTest('link with "data-method" and CSRF', 1, function() {
  $('#qunit-fixture')
    .append('<meta name="csrf-param" content="authenticity_token"/>')
    .append('<meta name="csrf-token" content="cf50faa3fe97702ca1ae"/>');

  submit(function(data) {
    equal(data.params.authenticity_token, 'cf50faa3fe97702ca1ae');
  });
});

asyncTest('whitelisted links with "data-method" get CSRF', 1, function() {
  $.rails.csrfWhitelistedDomains = /^localhost$/

  $('#qunit-fixture')
    .append('<meta name="csrf-param" content="authenticity_token"/>')
    .append('<meta name="csrf-token" content="cf50faa3fe97702ca1ae"/>');

  submit(function(data) {
    strictEqual(data.params.authenticity_token, 'cf50faa3fe97702ca1ae');
  });
});

asyncTest('non whitelisted links with "data-method" get no CSRF', 2, function() {
  $.rails.csrfWhitelistedDomains = /^rubyonrails.org$/

  $('#qunit-fixture')
    .append('<meta name="csrf-param" content="authenticity_token"/>')
    .append('<meta name="csrf-token" content="cf50faa3fe97702ca1ae"/>');

  submit(function(data) {
    strictEqual(data.params.authenticity_token, undefined);
    strictEqual(data.HTTP_X_CSRF_TOKEN, undefined);
  });
});

asyncTest('link "target" should be carried over to generated form', 1, function() {
  $('a[data-method]').attr('target', 'super-special-frame');
  submit(function(data) {
    equal(data.params._target, 'super-special-frame');
  });
});

})();
