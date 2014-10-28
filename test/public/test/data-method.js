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

var escapeMap = {
  '<': '&lt;',
  '>': '&gt;'
};
function escapeReplacer (entity) { return escapeMap[entity] || entity; }
function escapeHTML(str) { return String(str).replace(/<|>/g, escapeReplacer); }

asyncTest('link with "data-method" set to "post" and "data-params"', 4, function() {
  var value1 = 0,
    value2 = '\'quoted"/>&<\'value"',
    value3 = {foo: {bar: {baz: value2}}},
    params = {
      data1: value1,
      data2: value2,
      data3: value3
    };
  $('a[data-method]').attr({'data-method': 'post', 'data-params': JSON.stringify(params)});
  submit(function(data) {
    equal(data.REQUEST_METHOD, 'POST');
    equal(data.params.data1, escapeHTML(value1), 'params should have key data1 with right value');
    equal(data.params.data2, escapeHTML(value2), 'params should have key data2 with right value');
    propEqual(data.params.data3, {foo: {bar: {baz: escapeHTML(value2)}}}, 'params should have key data3 with right value');
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

})();
