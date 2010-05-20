var App = App || {};

App.build_form = function(opt) {
	var defaults = {
		'data-remote': 'true'
	};

	var options = $.extend(defaults, opt);

	$(document.body).append($('<form />', options));

	$('form').append($('<input />', {
		id: 'user_name',
		type: 'text',
		size: '30',
		'name': 'user_name',
		'value': 'john'
	}));
};

module('call-remote', {
	teardown: function() {
		$('form').remove();
	},
	setup: function() {
		App.build_form({
			'method': 'put',
			'data-method': 'fail',
			'action': 'www.example.com'
		});
	}
});

test('ajax:before callback returning false', function() {
	expect(0);

	$('form').bind('ajax:before', function() {
		return false;
	});

	jack(function() {
		jack.expect('$.ajax').never().mock(function(args) {});
		$('form[data-remote]').trigger('submit');
	});

});

test('ajax callbacks', function() {
	expect(3);

	$('form').bind('ajax:before', function() {
		ok(true, 'ajax:before');
		return true;
	});

	$('form').bind('ajax:loading', function(xhr) {
		ok(true, 'ajax:loading');
	});

	$('form').bind('ajax:success', function(array) {
		//ok(true, 'ajax:success');
	});

	$('form').bind('ajax:complete', function(xhr) {
		//ok(true, 'ajax:complete');
	});

	$('form').bind('ajax:error', function(array) {
		//ok(true, 'ajax:error');
	});

	$('form').bind('ajax:after', function() {
		ok(true, 'ajax:after');
	});

	$('form[data-remote]').trigger('submit');

});

