// test on dom modify event

(function(){
	module('widgets', {
	  setup: function() {
		$('#qunit-fixture').append($('<div />', {
			'data-feature': 'feature',
			'id': 'feature'
		}));
		$('#feature').append($('<a />', {
			href: '/echo',
			'data-remote': true,
			'data-action': 'create',
			'id': 'create_link'
		}));
	  }
	});	
		
	asyncTest('custom domModify event', 1, function(){		
		//QUnit is pretty annoying here.  if you don't un
		$(document).delegate('#new_element', 'domModify', function(e) {
			$(document).undelegate('#new_element', 'domModify');		
			
			start();
			ok(true, 'dom modify is triggered');
			return false;  //prevent bubble up
		});
		
		$('#feature').append($('<div />', {
			'id': 'new_element'
		}));
	});
	
	
	asyncTest('added widgets are initiated', 2, function(){
		$.fn.samplewidget = function(){
			start();
			ok(true, 'widget is called on dom modify');
			equal(arguments[0], "sampleWidgetArgs", 'arguments passed on from widget attr value');
			$.fn.sampleWidget = undefined;
		}
		$("#feature").append($('<div />', {
			'data-sampleWidget': 'sampleWidgetArgs'
		}));
	});	
	
	test('cycle widget', function(){
		$("#feature").attr('data-cycle', 'two').append($('<a />', {
			'data-action': 'one'
		})).append($('<a />', {
			'data-action': 'two'
		})).actuate();
		// console.log($(':action(two)'));
		
		equal($(':action(two)').attr('style'), "display: inline; ", 'second action link is shown');
		equal($(':action(one)').attr('style'), "display: none; ", 'first action link is hidden');
		
	});
	
})();