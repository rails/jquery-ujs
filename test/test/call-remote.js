var App = App || {};

App.build_form = function(opt) {
  
  console.log('opt is');
  console.log(opt);

	var defaults = {
		action: 'http://example.com/address',
		'data-remote': 'true'
	};
	
  var options = $.extend(defaults, opt);

  
  console.log('options is');
  console.log(options);

	$(document.body).append($('<form />', options));

	$('form').append($('<input />', {
		id: 'user_name',
		type: 'text',
		size: '30',
		'name': 'user_name',
		'value': 'john'
	}));
}

module('call-remote', {
	teardown: function() {
		$('form').remove();
	}
});

test('method should be picked up from method attribute', function() {
  expect(1);

  App.build_form({'method': 'put', 'data-method': 'fail'});

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

  App.build_form({'data-method': 'put'});

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

  App.build_form({});

	var ajaxArgs;

	jack(function() {
		jack.expect('$.ajax').once().mock(function(args) {
			ajaxArgs = args;
		});
		$('form[data-remote]').trigger('submit');
	});

	equals(ajaxArgs.type, 'GET', 'ajax arguments should have PUT as request type');
});
