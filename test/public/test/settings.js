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

// hijacks normal form submit; lets it submit to an iframe to prevent
// navigating away from the test suite
$(document).bind('submit', function(e) {
  if (!e.isDefaultPrevented()) {
    var form = $(e.target), action = form.attr('action'),
        name = 'form-frame' + jQuery.guid++,
        iframe = $('<iframe name="' + name + '" />'),
        targetInput = '<input name="_target" value="' + form.attr('target') + '" type="hidden" />';

    if (action.indexOf('iframe') < 0) form.attr('action', action + '?iframe=true')
    form.attr('target', name).append(targetInput);
    $('#qunit-fixture').append(iframe);
    $.event.trigger('iframe:loading', form);
  }
});
