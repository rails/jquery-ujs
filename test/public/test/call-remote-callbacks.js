(function(){

module('call-remote-callbacks', {
  setup: function() {
    $('#fixtures').append($('<form />', {
      action: '/echo', method: 'get', 'data-remote': 'true'
    }));
  },
  teardown: App.teardown
});

function submit(fn) {
  stop(App.ajax_timeout);
  
  var form = $('form')
    .bind('ajax:complete', function(){
      ok(true, 'ajax:complete');
      start();
    });
  
  if (fn) fn(form);
  form.trigger('submit');
}

test('stopping the "ajax:beforeSend" event aborts the request', function() {
  expect(0);
  submit(function(form) {
    form.bind('ajax:beforeSend', function() { return false });
    form.unbind('ajax:complete').bind('ajax:complete', function() {
      ok(false, 'ajax:complete should not run');
    });
  });
  setTimeout(function(){ start() }, 200);
});

test('"ajax:beforeSend" can be observed and stopped with event delegation', function() {
  expect(1);
  $('form[data-remote]').live('ajax:beforeSend', function() {
    ok(true, 'ajax:beforeSend observed with event delegation');
    return false;
  });
  
  submit(function(form) {
    form.unbind('ajax:complete').bind('ajax:complete', function() {
      ok(false, 'ajax:complete should not run');
    });
  });
  setTimeout(function(){ start() }, 200);
});

test('"ajax:beforeSend", "ajax:success" and "ajax:complete" are triggered', function() {
  expect(3);
  submit(function(form) {
    form.bind('ajax:beforeSend', function(arg) { ok(true, 'ajax:beforeSend') });
    form.bind('ajax:success', function(arg) { ok(true, 'ajax:success') });
  });
});

test('"ajax:beforeSend", "ajax:error" and "ajax:complete" are triggered on error', function() {
  expect(4);
  submit(function(form) {
    form.attr('action', '/error');
    form.bind('ajax:beforeSend', function(arg) { ok(true, 'ajax:beforeSend') });
    form.bind('ajax:error', function(e, xhr, status, error) { 
      ok(true, 'ajax:error'); 
      equals(xhr.status, 403, 'status code should be 403'); 
    });
  });
});

})();
