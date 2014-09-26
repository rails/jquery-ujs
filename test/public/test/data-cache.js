module('data-cache', {
  setup: function() {
    window.realAjax = $.rails.ajax;
    $('#qunit-fixture').append($('<a />', {
      href: '/echo', 'data-method': 'delete', 'data-cache': false, text: 'destroy!'
    }));
  },
  teardown: function() {
    $.rails.ajax = window.realAjax;
  }
});

asyncTest('link with "data-cache" set to false', 1, function() {
  $.rails.ajax = function(options) {
    equal(false, options.cache);
  }
  $.rails.handleRemote($('#qunit-fixture').find('a'));
  start();
});

asyncTest('link with "data-cache" set to true', 1, function() {
  $('#qunit-fixture').find('a').data('cache',true);
  $.rails.ajax = function(options) {
    equal(true, options.cache);
  }
  $.rails.handleRemote($('#qunit-fixture').find('a'));
  start();
});
