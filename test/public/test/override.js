(function(){

module('override', {
  setup: function() {
    window.realHref = $.rails.href;
    $('#qunit-fixture').append($('<a />', {
      href: '/real/href', 'data-method': 'delete', 'data-href': '/data/href'
    }));
  },
  teardown: function() {
    $.rails.href = window.realHref;
  }
});

asyncTest("the getter for an element's href is publicly accessible", 1, function() {
  ok($.rails.href);
  start();
});

asyncTest("the getter for an element's href is overridable", 1, function() {
  $.rails.href = function(element) { return element.data('href'); }
  $.rails.ajax = function(options) {
    equal('/data/href', options.url);
  }
  $.rails.handleRemote($('#qunit-fixture').find('a'));
  start();
});

asyncTest("the getter for an element's href works normally if not overridden", 1, function() {
  $.rails.ajax = function(options) {
    equal('/real/href', options.url);
  }
  $.rails.handleRemote($('#qunit-fixture').find('a'));
  start();
});

})();
