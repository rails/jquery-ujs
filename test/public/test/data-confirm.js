module('data-confirm', {
  setup: function() {
    $('#qunit-fixture').append($('<a />', {
      href: '/echo',
      'data-remote': 'true',
      'data-confirm': 'Are you absolutely sure?',
      text: 'my social security number'
    }));
  }
});

asyncTest('clicking on a link with data-confirm attribute. Confirm yes.', 4, function() {
  window.confirm = function(msg) {
    $(document.body).data('confirmation-message', msg);
    return true;
  };

  $('a[data-confirm]')
    .bind('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      App.assert_request_path(data, '/echo');
      App.assert_get_request(data); 

      equal( $(document.body).data('confirmation-message'),
             App.confirmation_message,
             'confirmation message should be same');

      start();
    })
    .trigger('click');
});

asyncTest('clicking on a link with data-confirm attribute. Confirm No.', 1, function() {
  window.confirm = function(msg) {
    $(document.body).data('confirmation-message', msg);
    return false;
  };

  $('a[data-confirm]')
    .bind('ajax:before', function(e, data, status, xhr) {
      App.assert_callback_not_invoked('ajax:before');
    })
    .trigger('click');

  // I don't have idea how to do it without timeout on "confirm: no", will need
  // to think about that
  setTimeout(function() {
    equal( $(document.body).data('confirmation-message'),
            App.confirmation_message,
            'confirmation message should be same');

    start();
  }, 100);
});
