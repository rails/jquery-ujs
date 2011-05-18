module('data-confirm', {
  setup: function() {
    $('#qunit-fixture').append($('<a />', {
      href: '/echo',
      'data-remote': 'true',
      'data-confirm': 'Are you absolutely sure?',
      text: 'my social security number'
    }));

    this.windowConfirm = window.confirm;
  },
  teardown: function() {
    window.confirm = this.windowConfirm;
  }
});

asyncTest('clicking on a link with data-confirm attribute. Confirm yes.', 6, function() {
  var message;
  // auto-confirm:
  window.confirm = function(msg) { message = msg; return true };

  $('a[data-confirm]')
    .bind('confirm:complete', function(e, data) {
      App.assert_callback_invoked('confirm:complete');
      ok(data == true, 'confirm:complete passes in confirm answer (true)');
    })
    .bind('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      App.assert_request_path(data, '/echo');
      App.assert_get_request(data); 

      equal(message, 'Are you absolutely sure?');
      start();
    })
    .trigger('click');
});

asyncTest('clicking on a link with data-confirm attribute. Confirm No.', 3, function() {
  var message;
  // auto-decline:
  window.confirm = function(msg) { message = msg; return false };

  $('a[data-confirm]')
    .bind('confirm:complete', function(e, data) {
      App.assert_callback_invoked('confirm:complete');
      ok(data == false, 'confirm:complete passes in confirm answer (false)');
    })
    .bind('ajax:beforeSend', function(e, data, status, xhr) {
      App.assert_callback_not_invoked('ajax:beforeSend');
    })
    .trigger('click');

  setTimeout(function() {
    equal(message, 'Are you absolutely sure?');
    start();
  }, 50);
});


asyncTest('binding to confirm event and returning false', 1, function() {
  // redefine confirm function so we can make sure it's not called
  window.confirm = function(msg) {
    ok(false, 'confirm dialog should not be called');
  };

  $('a[data-confirm]')
    .bind('confirm', function() {
      App.assert_callback_invoked('confirm');
      return false;
    })
    .bind('confirm:complete', function() {
      App.assert_callback_not_invoked('confirm:complete')
    })
    .trigger('click');

  setTimeout(function() {
    start();
  }, 50);
});

asyncTest('binding to confirm:complete event and returning false', 2, function() {
  // auto-confirm:
  window.confirm = function(msg) {
    ok(true, 'confirm dialog should be called');
    return true;
  };

  $('a[data-confirm]')
    .bind('confirm:complete', function() {
      App.assert_callback_invoked('confirm:complete');
      return false;
    })
    .bind('ajax:beforeSend', function() {
      App.assert_callback_not_invoked('ajax:beforeSend');
    })
    .trigger('click');

  setTimeout(function() {
    start();
  }, 50);
});
