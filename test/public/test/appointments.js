(function(){
	
	module('appointments', {
	  setup: function() {
		$('#qunit-fixture').append($('<div />', {
			'data-feature': 'feature',
			'id': 'feature'
		}))
		$('#feature').append($('<a />', {
			href: '/echo',
			'data-remote': true,
			'data-action': 'delete',
			'id': 'delete_link'
		}));
		$('#feature').append($('<a />', {
			href: '/echo',
			'data-remote': true,
			'data-action': 'update',
			'id': 'update_link'
		}));
	  },
	  teardown: function() {
		$('#delete_link').die('ajax:complete');  //these don't combine to 1 line
		$('#update_link').die('ajax:complete');
	  }
	});
	
	// test coverage is not complete here.  For example, custom target is not tested.
	
	// remove default functionality before queueing any tests.  This makes tests able to run regardless of sequence.
	$(document).dismiss('delete'); 
	
	asyncTest('default behavior is removable', 2, function(){
		var feature_orig = $('#feature').html();
						
		$("#delete_link").live('ajax:complete', function(){
			start();
			ok(true, 'ajax:complete');
			ok( ($('#feature').html() === feature_orig), 'feature is just the same');
		}).trigger('click');
	});

	asyncTest('default delete action deletes closest feature', 2, function(){
		$('#feature').appoint();
		$("#delete_link").live('ajax:complete', function(){ // why wont bind work here?
			start();
			ok(true, 'ajax:complete');
			ok( ($('#feature').length === 0), 'feature has been removed');
		}).trigger('click');
	});
	
	asyncTest('update replaces closest feature', 2, function(){
		$("#update_link").live('ajax:complete', function(e, data, status, xhr){
			start();
			ok(true, 'ajax:complete');
			ok( $("#feature").html().match('REQUEST_METHOD') , 'feature has updated content');
		}).trigger('click');
	});

	asyncTest('create prepends a new feature', 2, function(){
		$('#feature').append($('<a />', {
			href: '/echo',
			'data-remote': true,
			'data-action': 'create',
			'id': 'create_link'
		}));
		
		$("#create_link").live('ajax:complete', function(e, data, status, xhr){
			start();
			ok(true, 'ajax:complete');
			ok( $("#feature").html().match('REQUEST_METHOD') , 'feature has updated content');
		}).trigger('click');
	});

	asyncTest('new behavior can be added', 2, function(){		
		$("#feature").appoint('delete', function(){
			this.$feature.html('hello world!');
		});		
				
		$("#delete_link").live('ajax:complete', function(){
			start();
			ok(true, 'ajax:complete');
			ok( ($('#feature').html() === 'hello world!'), 'feature has custom content');
		}).trigger('click');
	});

	asyncTest('widgets can be appointed as callbacks', 2, function(){
		$.fn.testwidget = function(value){
			start();
			ok(true, 'testwidget actuated');
			equal(value, '456', 'custom value passed');
			$.fn.testwidget = undefined;
		}
		
		$('#feature').attr('data-testwidget', '123');
		$(':widget(testwidget)').append($('<a />', {
			href: '/echo',
			'data-remote': true,
			'data-action': 'testAction'
		}));
		$(document).appoint('testAction', '456');
		
		$(':action(testAction)').trigger('click');
	});
	
})();