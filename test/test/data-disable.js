
module('data-disable', {

	teardown: function() {
		$('form').remove();
	},

	setup: function() {

		$(document.body).append($('<form />', {
			action: 'http://example.com/address',
			'data-remote': 'true',
			method: 'post'
		}));

		$('form').append($('<input />', {
			id: 'user_name',
      'data-disable-with': 'processing ...',
			type: 'text',
			size: '30',
			'name': 'user_name',
			'value': 'john'
		}));

	}
});

test('triggering ajax callbacks on a form with data-disable attribute', function() {
	expect(6);

  equals($('input:disabled').size(), 0,  'input field should not be disabled');
  equals($('input').val(), 'john', 'input field should have value given to it');

  $('form').trigger('ajax:before');

  equals($('input:disabled').size(), 1, 'input field should be disabled');
  equals($('input:disabled').val(), 'processing ...', 'input field should have disabled value given to it');

  $('form').trigger('ajax:complete');

  equals($('input:disabled').size(), 0,  'input field should not be disabled');
  equals($('input').val(), 'john', 'input field should have value given to it');

});

