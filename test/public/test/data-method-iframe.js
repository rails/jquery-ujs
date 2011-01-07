module('data-method-iframe', {

  teardown: App.teardown,

  setup: function() {

    $('#fixtures-iframe').append($('<a />', {
      href: '/delete',
      'data-method': 'delete',
      text: 'Destroy'
    }));

  }
});

test('clicking on a link with data-method attribute', function() {

  /* 
   * There is nothing to verify here. The trigger clicks the link
   * which submits to /delete. The response given by /delete is asserted in
   * data-method-iframe.js
   */
  expect(0);
  stop();

  $('a[data-method]')
    .trigger('click');

    App.timeout();
});
