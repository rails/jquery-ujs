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
    equal(location.protocol + '//' + location.host + '/real/href', options.url);
  }
  $.rails.handleRemote($('#qunit-fixture').find('a'));
  start();
});

asyncTest("the event selector strings are overridable", 2, function() {
  var documentClickBindings = $._data(document, 'events').click,
      linkClickBinding = $.grep(documentClickBindings, function(a) {
        return a.selector && a.selector.indexOf('a[data-remote]') != -1;
      })[0];

  ok($.rails.linkClickSelector.indexOf(', a[data-custom-remote-link]') != -1, 'linkClickSelector contains custom selector');

  ok(linkClickBinding.selector.indexOf(', a[data-custom-remote-link]') != -1, 'actual document binding contains custom selector');

  start();
});

// Not sure why this test isn't working in jquery 1.7,
// or why the error message doesn't show in the console in 1.8
// when the test is run.
//
//asyncTest("including jquery-ujs multiple times throws error", 1, function() {
//  var script = document.createElement( 'script' );
//  script.type = 'text/javascript';
//  script.src = '/src/rails.js';
//  raises(function() {
//    $("#qunit-fixture").append( script );
//  }, 'appending rails.js again throws error');
//  setTimeout(function() { start(); }, 50);
//});

})();
