(function(){

module('data-method', {
  teardown: function() { $(document).unbind('iframe:loaded') }
});

function submit(fn) {
  $(document).bind('iframe:loaded', function(e, data) {
    fn(data);
    start();
  });
  
  $('#qunit-fixture').
    append($('<a />', { href: '/echo', 'data-method': 'delete', text: 'destroy!' }))
    .find('a').trigger('click');
}

asyncTest('link with "data-method" set to "delete"', 2, function() {
  submit(function(data) {
    equal(data.REQUEST_METHOD, 'DELETE');
    strictEqual(data.params.authenticity_token, undefined);
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

})();