module('data-remote');

test('clicking on a link with data-method attribute', function() {
	expect(1);
	stop(App.ajax_timeout);

  var iframe = $('#fixtures-iframe iframe');

  iframeCallback = function() {
		var data = iframe.contents().find('body').text();
		equals(data, "/delete was invoked with delete verb. params is {\"_method\"=>\"delete\"}", 'iframe should have proper response message');

		start();
	};

	//Nothing to do. Just wait for iframe to load and do its thing. And then verify
  if(iframe[0].loaded) {
    iframeCallback();
  } else {
    iframe.live("load", iframeCallback);
  }
});


test('clicking on a link with data-method attribute and csrf', function() {
	expect(1);
	stop(App.ajax_timeout);

  var iframe = $('#fixtures-iframe-csrf iframe');

  var iframeCallback = function() {
		var data = iframe.contents().find('body').text();
		equals(data, "/delete was invoked with delete verb. params is {\"_method\"=>\"delete\", \"authenticity_token\"=>\"cf50faa3fe97702ca1ae\"}", 
                 'iframe should be proper response message');

		start();
  };

	//Nothing to do. Just wait for iframe to load and do its thing. And then verify
  if(iframe[0].loaded) {
    iframeCallback();
  } else {
    iframe.live("load", iframeCallback);
  }
});
