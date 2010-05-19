module('data-method-not-data-remote', {
	teardown: function() {
		$('meta[name=csrf-token]').remove();
		$('meta[name=csrf-param').remove();
	},

	setup: function() {
		$(document.body).append($('<meta />', {
			name: 'csrf-param',
			content: 'authenticity_token'
		}));

		$(document.body).append($('<meta />', {
			name: 'csrf-token',
			content: 'DHXJtR+rJ93tFjp7H12zA82PS1UWKiRNgEHXN7nMaU8='
		}));
	}
});

test('invoking success callback', function() {
	expect(1);
	AdminData.actOnResult.successCallback({
		success: 'hello world'
	});
	equals('hello world', $('#results').text(), '#results should have text hello world');
});
