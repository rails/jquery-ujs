module('data-confirm', {

  teardown: App.teardown,

  setup: function() {

    $('#fixtures').append($('<a />', {
      href: '/echo',
      'data-remote': 'true',
      'data-confirm': 'Are you absolutely sure?',
      text: 'my social security number'
    }));

    $('#fixtures').append($('<form />', { action: '/echo', 'data-remote': 'true' }));

    $('#fixtures form').append($('<input />', {
      'data-confirm': App.confirmation_message,
      name: 'submit',
      type: 'submit',
      value: 'Click me'
    }));

    $('#fixtures form').append($('<button />', {
      'data-confirm': App.confirmation_message,
      name: 'submit',
      type: 'button',
      value: 'Press me'
    }));

  }
});

test('clicking on a link with data-confirm attribute. Confirm yes.', function() {
  expect(4);

  window.confirm = function(msg) {
    $(document.body).data('confirmation-message', msg);
    return true;
  };

  stop(App.ajax_timeout);

  $('a[data-confirm]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      var request_env = data.request_env;
      App.assert_request_path(request_env, '/echo');
      App.assert_get_request(request_env); 

      equals( $(document.body).data('confirmation-message'),
             App.confirmation_message,
             'confirmation message should be same');

      start();
    })
    .trigger('click');
});

test('clicking on a link with data-confirm attribute. Confirm No.', function() {
  expect(1);

  window.confirm = function(msg) {
    $(document.body).data('confirmation-message', msg);
    return false;
  };

  stop();
  $('a[data-confirm]')
    .live('ajax:before', function(e, data, status, xhr) {
      App.assert_callback_not_invoked('ajax:before');
    })
    .trigger('click');

  // I don't have idea how to do it without timeout on "confirm: no", will need
  // to think about that
  setTimeout(function() {
    equals( $(document.body).data('confirmation-message'),
            App.confirmation_message,
            'confirmation message should be same');

    start();
  }, 100);
});
