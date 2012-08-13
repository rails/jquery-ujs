(function(){

module('override', {
  setup: function() {
    window.realHref = $.rails.href;
    $('#qunit-fixture')
      .append($('<a />', {
        href: '/real/href', 'data-method': 'delete', 'data-href': '/data/href'
      }))
      .append($('<a />', {
        href: '/other/href', 'data-custom-remote-link': 'true'
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

asyncTest("the event selector strings are overridable", 2, function() {
  var documentClickBindings = $(document).data('events').click,
      linkClickBinding = $.grep(documentClickBindings, function(a) {
        return a.selector.indexOf('a[data-remote]') != -1;
      })[0];

  ok($.rails.linkClickSelector.indexOf(', a[data-custom-remote-link]') != -1, 'linkClickSelector contains custom selector');

  ok(linkClickBinding.selector.indexOf(', a[data-custom-remote-link]') != -1, 'actual document binding contains custom selector');

  start();
});

})();
