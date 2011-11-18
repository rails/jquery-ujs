(function(){

module('data-method', {
  setup: function() {
    $('#qunit-fixture').append($('<a />', {
      href: '/echo', 'data-method': 'delete', text: 'destroy!'
    }));
  }
});

function submit(fn, options) {
  $('#qunit-fixture').find('a')
      .bind('iframe:loaded', function(e, data) {
        fn(data);
        start();
      })
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

asyncTest('link "target" should be carried over to generated form', 1, function() {
  $('a[data-method]').attr('target', 'super-special-frame');
  submit(function(data) {
    equal(data.params._target, 'super-special-frame');
  });
});


asyncTest('data-params should be carried over to generated form', 2, function() {
  $('a[data-method]').attr('data-params', 'a_param=a_value&nested[param]=encoded%20value+example');
  submit(function(data) {
    equal(data.params.a_param, 'a_value');
    equal(data.params.nested.param, 'encoded value example');
  });
});

})();
