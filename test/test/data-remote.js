module('data-remote', {

	teardown: function() {
		$('a').remove();
		$('input').remove();
		$('form').remove();
	},

	setup: function() {

		$(document.body).append($('<a />', {
			href: 'http://example.com/address',
			'data-remote': 'true',
			text: 'my address'
		}));

		$(document.body).append($('<input />', {
			href: 'http://example.com/address',
			'data-remote': 'true',
			name: 'submit',
			type: 'submit',
			value: 'Click me'
		}));

		$(document.body).append($('<form />', {
			action: 'http://example.com/address',
			'data-remote': 'true',
			method: 'post'
		}));

		$('form').append($('<input />', {
			id: 'user_name',
			type: 'text',
			size: '30',
			'name': 'user_name',
			'value': 'john'
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

test('clicking on Submit input tag with data-remote attribute', function() {
	expect(3);

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('input[data-remote]').trigger('click');
	});

	equals(ajaxArgs.url, 'http://example.com/address', 'ajax arguments should have passed url');
	equals(ajaxArgs.dataType, 'script', 'ajax arguments should have script as the data type');
	equals(ajaxArgs.type, 'GET', 'ajax arguments should have GET as request type');
});

test('Sbumitting form with data-remote attribute', function() {
	expect(5);

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('form[data-remote]').trigger('submit');
	});

	equals(ajaxArgs.url, 'http://example.com/address', 'ajax arguments should have passed url');
	equals(ajaxArgs.dataType, 'script', 'ajax arguments should have script as the data type');
	equals(ajaxArgs.type, 'POST', 'ajax arguments should have GET as request type');

  equals(ajaxArgs.data[0]['name'], "user_name", 'ajax arguments should have name key');
  equals(ajaxArgs.data[0]['value'], "john", 'ajax arguments should have value key');
});

