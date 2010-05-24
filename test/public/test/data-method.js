module('data-remote');

test('clicking on a link with data-method attribute', function() {
	expect(1);
	stop();

	//Nothing to do. Just wait for iframe to load and do its thing. And then verify
	setTimeout(function() {
		start();
		var data = $('#fixtures iframe').contents().find('body').text();
		equals(data, '/delete was invoked with delete verb', 'data should be same');
	},
	App.ajax_timeout);

});

