(function(){

module('call-remote-callbacks', {
  setup: function() {
    $('#qunit-fixture').append($('<form />', {
      action: '/echo', method: 'get', 'data-remote': 'true'
    }));
  },
  teardown: function() {
    $('form[data-remote]').die('ajax:beforeSend');
  }
});

function submit(fn) {
  var form = $('form')
    .bind('ajax:complete', function(){
      ok(true, 'ajax:complete');
      start();
    });
  
  if (fn) fn(form);
  form.trigger('submit');
}

asyncTest('stopping the "ajax:beforeSend" event aborts the request', 1, function() {
  submit(function(form) {
    form.bind('ajax:beforeSend', function() {
      ok(true, 'aborting request in ajax:beforeSend')
      return false;
    });
    form.unbind('ajax:complete').bind('ajax:complete', function() {
      ok(false, 'ajax:complete should not run');
    });
    form.bind('ajax:error', function(e, xhr, status, error) {
      ok(false, 'ajax:error should not run');
    });
    form.bind('ajaxStop', function() {
      start();
    });
  });
});

asyncTest('blank required form input field should abort request', 1, function() {
  var form = $('form[data-remote]')
    .append($('<input type="text" name="user_name" required="required">'))
    .bind('ajax:beforeSend', function() {
      ok(false, 'ajax:beforeSend should not run');
    })
    .bind('iframe:loading', function() {
      ok(false, 'form should not get submitted');
    })
    .trigger('submit');

  setTimeout(function() {
    form.find('input[required]').val('Tyler');
    form.bind('ujs:requiredField', function(){
      ok(false, 'form should not trigger ujs:requiredField custom event');
    }));
    form.unbind('ajax:beforeSend');
    submit();
  }, 13);
});

asyncTest("blank required form input should trigger ujs:requiredField event", 3, function(){
  var form = $('form[data-remote]')
    .append($('<input type="text" name="user_name" required="required">'))
    .bind('ajax:beforeSend', function() {
      ok(false, 'ajax:beforeSend should not run');
    })
    .bind('ujs:requiredField', function(){
      ok(true, 'form should trigger ujs:requiredField custom event');
    })
    .trigger('submit');

    setTimeout(function() {
      form.unbind('ajax:beforeSend ujs:requiredField');
      form.bind('ujs:requiredField', function(){
        ok(true, 'bypasses required valditaion when the event is stopped');
        return false;
      });
      submit();
    }, 13);
});

asyncTest('"ajax:beforeSend" can be observed and stopped with event delegation', 1, function() {
  $('form[data-remote]').live('ajax:beforeSend', function() {
    ok(true, 'ajax:beforeSend observed with event delegation');
    return false;
  });
  
  submit(function(form) {
    form.unbind('ajax:complete').bind('ajax:complete', function() {
      ok(false, 'ajax:complete should not run');
    });
    form.bind('ajaxStop', function() {
      start();
    });
  });
});

asyncTest('"ajax:beforeSend", "ajax:success" and "ajax:complete" are triggered', 8, function() {
  submit(function(form) {
    form.bind('ajax:beforeSend', function(e, xhr, settings) {
      ok(xhr.setRequestHeader, 'first argument to "ajax:beforeSend" should be an XHR object');
      equal(settings.url, '/echo', 'second argument to "ajax:beforeSend" should be a settings object');
    });
    form.bind('ajax:success', function(e, data, status, xhr) {
      ok(data.REQUEST_METHOD, 'first argument to ajax:success should be a data object');
      equal(status, 'success', 'second argument to ajax:success should be a status string');
      ok(xhr.getResponseHeader, 'third argument to "ajax:success" should be an XHR object');
    });
    form.bind('ajax:complete', function(e, xhr, status) {
      ok(xhr.getResponseHeader, 'first argument to "ajax:complete" should be an XHR object');
      equal(status, 'success', 'second argument to ajax:complete should be a status string');
    });
  });
});

asyncTest('"ajax:beforeSend", "ajax:error" and "ajax:complete" are triggered on error', 6, function() {
  submit(function(form) {
    form.attr('action', '/error');
    form.bind('ajax:beforeSend', function(arg) { ok(true, 'ajax:beforeSend') });
    form.bind('ajax:error', function(e, xhr, status, error) { 
      ok(xhr.getResponseHeader, 'first argument to "ajax:error" should be an XHR object');
      equal(status, 'error', 'second argument to ajax:error should be a status string');
      if (jQuery().jquery.indexOf('1.4') === 0) strictEqual(error, undefined)
      else equal(error, 'Forbidden', 'third argument to ajax:error should be an HTTP status response');
      // Opera returns "0" for HTTP code
      equal(xhr.status, window.opera ? 0 : 403, 'status code should be 403');
    });
  });
});

})();
