var App = App || {};

App.assert_callback_invoked = function(callback_name) {
  ok(true, callback_name + ' callback should have been invoked');
};

App.assert_callback_not_invoked = function(callback_name) {
  ok(false, callback_name + ' callback should not have been invoked');
};

App.assert_get_request = function(request_env){
  equal(request_env['REQUEST_METHOD'], 'GET', 'request type should be GET');
};

App.assert_post_request = function(request_env){
  equal(request_env['REQUEST_METHOD'], 'POST', 'request type should be POST');
};

App.assert_request_path = function(request_env, path) {
  equal(request_env['PATH_INFO'], path, 'request should be sent to right url');
};

// hijacks normal form submit; lets it submit to an iframe to prevent
// navigating away from the test suite
//$(document).bind('submit', function(e) {
//  if (!e.isDefaultPrevented()) {
//    var form = $(e.target), action = form.attr('action'),
//        name = 'form-frame' + jQuery.guid++,
//        iframe = $('<iframe name="' + name + '" />');
//
//    if (action.indexOf('iframe') < 0) form.attr('action', action + '?iframe=true')
//    form.attr('target', name);
//    $('#qunit-fixture').append(iframe);
//    $.event.trigger('iframe:loading', form);
//  }
//});

// The above doesn't work, since rails.js now calls the dom-level form.submit() function
// for normal forms after all bindings have been run. The below more directly accomplishes
// its intentions anyway, for the purposes of making sure the test suite never navigates
// to a new page for non-ajax submitted forms.
// See for explanation: http://diveintogreasemonkey.org/patterns/override-method.html
var iframeSubmit = function(event) {
  var target = event ? event.target : this,
      form = $(target), action = form.attr('action'),
      name = 'form-frame' + jQuery.guid++,
      iframe = $('<iframe name="' + name + '" />');

  if (action.indexOf('iframe') < 0) form.attr('action', action + '?iframe=true')
  form.attr('target', name);
  $('#qunit-fixture').append(iframe);
  $.event.trigger('iframe:loading', form);

  this._submit();
}

// capture the onsubmit event on all forms
window.addEventListener('submit', iframeSubmit, true);

// If a script calls someForm.submit(), the onsubmit event does not fire,
// so we need to redefine the submit method of the HTMLFormElement class.
HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
HTMLFormElement.prototype.submit = iframeSubmit;
