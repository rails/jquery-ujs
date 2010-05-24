module('data-remote');

test('clicking on a link with data-method attribute', function() {
	expect(1);
	stop();

	//Nothing to do. Just wait for iframe to load and do its thing. And then verify
	setTimeout(function() {
		start();
		var data = $('#fixtures-iframe iframe').contents().find('body').text();
		equals(data, "/delete was invoked with delete verb. params is {\"_method\"=>\"delete\"}", 'iframe should have proper response message');
	},
	App.ajax_timeout);

});


test('clicking on a link with data-method attribute and csrf', function() {
	expect(1);
	stop();

	//Nothing to do. Just wait for iframe to load and do its thing. And then verify
	setTimeout(function() {
		start();
		var data = $('#fixtures-iframe-csrf iframe').contents().find('body').text();
		equals(data, "/delete was invoked with delete verb. params is {\"_method\"=>\"delete\", \"authenticity_token\"=>\"cf50faa3fe97702ca1ae\"}", 
                 'iframe should be proper response message');
	},
	App.ajax_timeout);

});


