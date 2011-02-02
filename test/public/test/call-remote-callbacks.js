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
    form.unbind('ajax:beforeSend');
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

asyncTest('"ajax:beforeSend", "ajax:success" and "ajax:complete" are triggered', 3, function() {
  submit(function(form) {
    form.bind('ajax:beforeSend', function(arg) { ok(true, 'ajax:beforeSend') });
    form.bind('ajax:success', function(arg) { ok(true, 'ajax:success') });
  });
});

asyncTest('"ajax:beforeSend", "ajax:error" and "ajax:complete" are triggered on error', 4, function() {
  submit(function(form) {
    form.attr('action', '/error');
    form.bind('ajax:beforeSend', function(arg) { ok(true, 'ajax:beforeSend') });
    form.bind('ajax:error', function(e, xhr, status, error) { 
      ok(true, 'ajax:error'); 
      // Opera returns "0" for HTTP code
      equal(xhr.status, window.opera ? 0 : 403, 'status code should be 403');
    });
  });
});

})();
