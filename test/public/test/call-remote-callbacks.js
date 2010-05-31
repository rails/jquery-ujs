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

module('call-remote', {

	teardown: App.teardown,

	setup: function() {
		App.build_form({
			'action': App.url('show')
		});
	}
});

test('if ajax:before callback returns false then do not proceed', function() {
  expect(0);
  stop();

  $('form')
    .bind('ajax:before', function() { return false; })
    .bind('ajax:loading', function(){
      ok(false, 'ajax call should not have been made since ajax:before callback returns false');
    });

  $('form[data-remote]').trigger('submit');

  App.short_timeout();
});

test('before, loading, success, complete and after callbacks should be called', function() {
	expect(5);
  stop(App.ajax_timeout);

	$('form')
    .bind('ajax:before', function() { ok(true, 'ajax:before'); return true; })
	  .bind('ajax:loading',  function(arg) { ok(true, 'ajax:loading'); })
	  .bind('ajax:success',  function(arg) { ok(true, 'ajax:success'); })
	  .bind('ajax:complete', function(arg) { ok(true, 'ajax:complete'); })
	  .bind('ajax:after',    function() { ok(true, 'ajax:after'); start(); });

	$('form[data-remote]').trigger('submit');
});

test('before, loading, error, complete and after callbacks should be called in case of error', function() {
	expect(6);
  $('form').attr('action', App.url('error'));
  stop(App.ajax_timeout);

	$('form')
    .bind('ajax:before', function() { ok(true, 'ajax:before'); return true; })
	  .bind('ajax:loading',  function(arg) { ok(true, 'ajax:loading'); })
	  .bind('ajax:failure',  function(e, xhr, status, error) { 
      ok(true, 'ajax:failure'); 
      equals(xhr.status, 403, 'status code should be 403'); 
    })
	  .bind('ajax:complete', function(arg) { ok(true, 'ajax:complete'); })
	  .bind('ajax:after',    function() { ok(true, 'ajax:after'); start(); });

	$('form[data-remote]').trigger('submit');
});


