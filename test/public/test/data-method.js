// NOT WORKING
module('data-remote', {

	teardown: App.teardown,

	setup: function() {

		$('#fixtures').append($('<a />', {
			href: App.url('show'),
			'data-method': 'delete',
			text: 'Destroy'
		}));

	}
});

test('clicking on a link with data-method attribute', function() {
  expect(3);
  stop();

  $('a[data-method]')
    .trigger('click');

  setTimeout(function() { 
    start(); 
    equals($('form').size(),1, 'there should be a form');
    equals($('form').attr('action'), App.url('update'), 'form action should be same as the link href');
  }, App.ajax_timeout);

});

