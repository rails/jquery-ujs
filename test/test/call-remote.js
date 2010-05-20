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
	}
});

test('method should be picked up from method attribute', function() {
	expect(1);

	App.build_form({
		'method': 'put',
		'data-method': 'fail',
		'action': 'www.example.com'
	});

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('form[data-remote]').trigger('submit');
	});

	equals(ajaxArgs.type, 'PUT', 'ajax arguments should have PUT as request type');
});

test('method should be picked up from data-method attribute', function() {
	expect(1);

	App.build_form({
		'data-method': 'put',
		'action': 'www.example.com'
	});

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('form[data-remote]').trigger('submit');
	});

	equals(ajaxArgs.type, 'PUT', 'ajax arguments should have PUT as request type');
});

test('default method should be picked up', function() {
	expect(1);

	App.build_form({
		action: 'www.example.com'
	});

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('form[data-remote]').trigger('submit');
	});

	equals(ajaxArgs.type, 'GET', 'ajax arguments should have GET as request type');
});

test('url should be picked up from action', function() {
	expect(1);

	App.build_form({
		'action': 'http://example.com'
	});

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('form[data-remote]').trigger('submit');
	});

	equals(ajaxArgs.url, 'http://example.com', 'ajax arguments should have valid url');
});

test('url should be picked up from action even if href is mentioned ', function() {
	expect(1);

	App.build_form({
		'action': 'http://example.com',
		'href': 'http://example.org'
	});

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('form[data-remote]').trigger('submit');
	});

	equals(ajaxArgs.url, 'http://example.com', 'ajax arguments should have valid url');
});

test('url should be picked up from href', function() {
	expect(1);

	App.build_form({
		'href': 'http://example.org'
	});

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('form[data-remote]').trigger('submit');
	});

	equals(ajaxArgs.url, 'http://example.org', 'ajax arguments should have valid url');
});

test('missing url should throw exception', function() {
	expect(1);
	var exception_was_raised = false;

	App.build_form({});

	try {
		$('form[data-remote]').trigger('submit');
	} catch(err) {
		exception_was_raised = true;
	}

	ok(exception_was_raised, 'exception should have been raised');
});

test('data-type should be picked up from attribute', function() {
	expect(1);

	App.build_form({
		'data-type': 'json',
		'href': 'www.example.com'
	});

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('form[data-remote]').trigger('submit');
	});

	equals(ajaxArgs.dataType, 'json', 'ajax arguments should have dataType from data-type attribute');
});

test('data-type should be default data-type', function() {
	expect(1);

	App.build_form({
		'href': 'www.example.com'
	});

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('form[data-remote]').trigger('submit');
	});

	equals(ajaxArgs.dataType, 'script', 'ajax arguments should have default dataType');
});

