module('data-remote', {

	teardown: function() {
		$('a').remove();
	},

	setup: function() {

		$(document.body).append($('<a />', {
			href: 'http://example.com/users/1',
			'data-method': 'delete',
			text: 'Destroy'
		}));

	}
});

test('clicking on a link with data-method attribute', function() {
	expect(3);

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('a[data-method]').trigger('click');
	});

	equals(ajaxArgs.url, 'http://example.com/users/1', 'ajax arguments should have passed url');
	equals(ajaxArgs.dataType, 'script', 'ajax arguments should have script as the data type');
	equals(ajaxArgs.type, 'POST', 'ajax arguments should have GET as request type');
});

