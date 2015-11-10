var App = App || {};

App.assertCallbackInvoked = function(callbackName) {
  ok(true, callbackName + ' callback should have been invoked');
};

App.assertCallbackNotInvoked = function(callbackName) {
  ok(false, callbackName + ' callback should not have been invoked');
};

App.assertGetRequest = function(requestEnv){
  equal(requestEnv['REQUEST_METHOD'], 'GET', 'request type should be GET');
};

App.assertPostRequest = function(requestEnv){
  equal(requestEnv['REQUEST_METHOD'], 'POST', 'request type should be POST');
};

App.assertRequestPath = function(requestEnv, path) {
  equal(requestEnv['PATH_INFO'], path, 'request should be sent to right url');
};

App.getVal = function(el) {
  return el.is('input,textarea,select') ? el.val() : el.text();
};

App.disabled = function(el) {
  return el.is('input,textarea,select,button') ? (el.is(':disabled') && el.data('ujs:disabled')) : el.data('ujs:disabled');
};

App.checkEnabledState = function(el, text) {
  ok(!App.disabled(el), el.get(0).tagName + ' should not be disabled');
  equal(App.getVal(el), text, el.get(0).tagName + ' text should be original value');
};

App.checkDisabledState = function(el, text) {
  ok(App.disabled(el), el.get(0).tagName + ' should be disabled');
  equal(App.getVal(el), text, el.get(0).tagName + ' text should be disabled value');
};

// hijacks normal form submit; lets it submit to an iframe to prevent
// navigating away from the test suite
$(document).bind('submit', function(e) {
  if (!e.isDefaultPrevented()) {
    var form = $(e.target), action = form.attr('action'),
        name = 'form-frame' + jQuery.guid++,
        iframe = $('<iframe name="' + name + '" />'),
        targetInput = '<input name="_target" value="' + form.attr('target') + '" type="hidden" />';

    if (action && action.indexOf('iframe') < 0) form.attr('action', action + '?iframe=true')
    form.attr('target', name).append(targetInput);
    $('#qunit-fixture').append(iframe);
    $.event.trigger('iframe:loading', form);
  }
});
