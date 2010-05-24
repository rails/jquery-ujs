module('data-remote', {

	//teardown: App.teardown,

	setup: function() {

    $('#fixtures iframe').contents().find('.iframe').append($('<a />', {
			href: App.url('delete'),
			'data-method': 'delete',
      'data-attach': 'iframe_form',
			text: 'Destroy'
		}));

	}
});

test('clicking on a link with data-method attribute', function() {
  expect(8);
  stop();

  $('a[data-method]')
    .trigger('click');

  setTimeout(function() { 
    start(); 
    equals($('#iframe_form form').size(),1, 'there should be a form');
    equals($('#iframe_form form:hidden').size(),1, 'there should be a hidden form');

    var form = $('#iframe_form form'),
        input_tags = form.find('input'),
        input_tag = input_tags.first();
    
    equals(form.attr('method'), 'post', 'form must submit using POST');
    equals(form.attr('action'), App.url('update'), 'form must have the action same as link href');

    equals(input_tags.size(), 1, 'form must have an input tag');
    equals(input_tag.attr('name'), '_method', "name of input tag must be _method");
    equals(input_tag.attr('value'), 'delete', "value of input tag must be delete");
    equals(input_tag.attr('type'), 'hidden', "type of input tag must be hidden");



  }, App.ajax_timeout);

});

