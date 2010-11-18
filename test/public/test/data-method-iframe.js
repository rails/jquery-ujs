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

test('double clicking on a link with data-method attribute', function() {
  expect(0);
  stop();

  $('a[data-method]')
    .trigger('click');
  
  $('a[data-method]').attr('href', App.url('update'))
    .trigger('click');

    App.timeout();
});
