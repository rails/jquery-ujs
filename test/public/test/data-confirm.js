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

asyncTest('clicking on a link with data-confirm attribute. Confirm yes.', 4, function() {
  var message;
  // auto-confirm:
  window.confirm = function(msg) { message = msg; return true };

  $('a[data-confirm]')
    .bind('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      App.assert_request_path(data, '/echo');
      App.assert_get_request(data); 

      equal(message, 'Are you absolutely sure?');
      start();
    })
    .trigger('click');
});

asyncTest('clicking on a link with data-confirm attribute. Confirm No.', 1, function() {
  var message;
  // auto-decline:
  window.confirm = function(msg) { message = msg; return false };

  $('a[data-confirm]')
    .bind('ajax:beforeSend', function(e, data, status, xhr) {
      App.assert_callback_not_invoked('ajax:beforeSend');
    })
    .trigger('click');

  setTimeout(function() {
    equal(message, 'Are you absolutely sure?');
    start();
  }, 50);
});
