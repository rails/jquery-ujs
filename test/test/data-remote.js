//$('form[data-remote]').live('submit', function (e) {
//$('a[data-remote],input[data-remote]').live('click', function (e) {
module('data-remote', {
	teardown: function() {
		$('a').remove();
	},

	setup: function() {
		$(document.body).append($('<a />', {
			href: 'http://example.com/address',
			'data-remote': 'true',
			text: 'my address'
		}));
	}
});

test('clicking on a link with data-remote attribute', function() {
	expect(3);

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('a[data-remote]').trigger('click');
	});

	equals(ajaxArgs.url, 'http://example.com/address', 'ajax arguments should have passed url');
	equals(ajaxArgs.dataType, 'script', 'ajax arguments should have script as the data type');
	equals(ajaxArgs.type, 'GET', 'ajax arguments should have GET as request type');
});

