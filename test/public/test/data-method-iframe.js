module('data-remote-iframe', {

  teardown: App.teardown,

  setup: function() {

    $('#fixtures-iframe').append($('<a />', {
      href: App.url('delete'),
      'data-method': 'delete',
      text: 'Destroy'
    }));

  }
});

test('clicking on a link with data-method attribute', function() {
  expect(0);
  stop();

  $('a[data-method]')
    .trigger('click');

    App.timeout();
});
