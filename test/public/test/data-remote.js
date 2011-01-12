module('data-remote', {

  teardown: App.teardown,

  setup: function() {
    $('#qunit-fixture')
      .append($('<a />', {
        href: '/echo',
        'data-remote': 'true',
        text: 'my address'
      }))
      .append($('<form />', {
        action: '/echo',
        'data-remote': 'true',
        method: 'post'
      }))
      .find('form').append($('<input type="text" name="user_name" value="john">'));
  }
});

asyncTest('clicking on a link with data-remote attribute', 3, function() {
  $('a[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      App.assert_request_path(data, '/echo');
      App.assert_get_request(data); 

      start();
    })
    .trigger('click');
});

asyncTest('Submitting form with data-remote attribute', 4, function() {
  $('form[data-remote]')
    .live('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');

      App.assert_request_path(data, '/echo');
      equal(data.params.user_name, 'john', 'ajax arguments should have key user_name with right value');
      App.assert_post_request(data); 

      start();
    })
    .trigger('submit');
});

