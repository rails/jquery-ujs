module('data-confirm', {
	teardown: function() {
		$('a').remove();
		$('input').remove();
	},

	setup: function() {

		$(document.body).append($('<a />', {
			href: 'http://example.com/address',
			'data-confirm': 'Are you absolutely sure?',
			'data-remote': 'true',
			text: 'my address',
		}));

		$(document.body).append($('<input />', {
			href: 'http://example.com/address',
			'data-remote': 'true',
			'data-confirm': 'Are you absolutely sure?',
			name: 'submit',
			type: 'submit',
			value: 'Click me'
		}));

	}
});

test('clicking on a link with data-confirm attribute. Confirm yes.', function() {
	expect(1);

	window.confirm = function(msg) {
		$(document.body).data('confirmation-message', msg);
		return true;
	}

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('a[data-confirm]').trigger('click');
	});

	equals($(document.body).data('confirmation-message'), 
         'Are you absolutely sure?', 
         'confirmation message should be same');

});

test('clicking on a link with data-confirm attribute. Confirm No.', function() {
	expect(1);

	window.confirm = function(msg) {
		$(document.body).data('confirmation-message', msg);
		return false;
	}

	jack(function() {
		jack.expect('$.ajax').never().mock(function(args) {
			ajaxArgs = args;
		});
		$('a[data-confirm]').trigger('click');
	});

	equals($(document.body).data('confirmation-message'), 
         'Are you absolutely sure?', 
         'confirmation message should be same');

});

test('clicking on Submit input tag with data-confirm attribute. Confirm yes.', function() {
	expect(0);

	window.confirm = function(msg) {
		$(document.body).data('confirmation-message', msg);
		return true;
	}

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('input[data-confirm]').trigger('click');
	});

	equals($(document.body).data('confirmation-message'), 
         'Are you absolutely sure?', 
         'confirmation message should be same');

});

test('clicking on Submit input tag with data-confirm attribute. Confirm no.', function() {
	expect(0);

	window.confirm = function(msg) {
		$(document.body).data('confirmation-message', msg);
		return false;
	}

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').never().mock(function(args) {
			ajaxArgs = args;
		});
		$('input[data-confirm]').trigger('click');
	});

	equals($(document.body).data('confirmation-message'), 
         'Are you absolutely sure?', 
         'confirmation message should be same');

});

