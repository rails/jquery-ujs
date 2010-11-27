var App = App || {};

App.build_form = function(opt) {
	var defaults = {
		'data-remote': 'true'
	};

	var options = $.extend(defaults, opt);

	$('#fixtures').append($('<form />', options));

	$('form').append($('<input />', {
		id: 'user_name',
		type: 'text',
		size: '30',
		'name': 'user_name',
		'value': 'john'
	}));
};

module('call-remote-callbacks', {

	teardown: App.teardown,

	setup: function() {
		App.build_form({
			'action': App.url('show')
		});
	}
});

test('ajax:beforeSend returns false do not proceed', function() {
  expect(0);
  stop();

  $('form')
    .bind('ajax:beforeSend', function() { return false; })
    .bind('ajax:complete', function(){
      ok(false, 'ajax call should not have been made since ajax:beforeSend callback returns false');
    });

  $('form[data-remote]').trigger('submit');

  App.short_timeout();
});

test('beforeSend, success and complete callbacks should be called', function() {
	expect(3);
  stop(App.ajax_timeout);

	$('form')
	  .bind('ajax:beforeSend',  function(arg) { ok(true, 'ajax:beforeSend'); })
	  .bind('ajax:success',  function(arg) { ok(true, 'ajax:success'); })
	  .bind('ajax:complete', function(arg) { ok(true, 'ajax:complete'); start(); });

	$('form[data-remote]').trigger('submit');
});

test('beforeSend, error and complete callbacks should be called in case of error', function() {
	expect(4);
  $('form').attr('action', App.url('error'));
  stop(App.ajax_timeout);

	$('form')
	  .bind('ajax:beforeSend',  function(arg) { ok(true, 'ajax:beforeSend'); })
	  .bind('ajax:error',  function(e, xhr, status, error) { 
      ok(true, 'ajax:error'); 
      equals(xhr.status, 403, 'status code should be 403'); 
    })
	  .bind('ajax:complete', function(arg) { ok(true, 'ajax:complete'); start(); });

	$('form[data-remote]').trigger('submit');
});


