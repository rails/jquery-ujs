module('data-remote', {
  setup: function() {
    $('#qunit-fixture')
      .append($('<a />', {
        href: '/echo',
        'data-remote': 'true',
        'data-params': 'data1=value1&data2=value2',
        text: 'my address'
      }))
      .append($('<form />', {
        action: '/echo',
        'data-remote': 'true',
        method: 'post'
      }))
      .find('form').append($('<input type="text" name="user_name" value="john">'))
			.append($('<select />', {
				'name': 'user_data',
				'data-remote': 'true',
        'data-params': 'data1=value1',
				'data-url': '/echo'
			}))
			.find('select')
			.append($('<option />', {value: 'optionValue1', text: 'option1'}))
			.append($('<option />', {value: 'optionValue2', text: 'option2'}));
  }
});

asyncTest('clicking on a link with data-remote attribute', 5, function() {
  $('a[data-remote]')
    .bind('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      App.assert_request_path(data, '/echo');
      equal(data.params.data1, 'value1', 'ajax arguments should have key data1 with right value');
      equal(data.params.data2, 'value2', 'ajax arguments should have key data2 with right value');
      App.assert_get_request(data); 
    })
    .bind('ajax:complete', function() { start() })
    .trigger('click');
});

asyncTest('changing a select option with data-remote attribute', 5, function() {
  $('select[data-remote]')
    .bind('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      App.assert_request_path(data, '/echo');
      equal(data.params.user_data, 'optionValue2', 'ajax arguments should have key term with right value');
			equal(data.params.data1, 'value1', 'ajax arguments should have key data1 with right value');
      App.assert_get_request(data); 
    })
    .bind('ajax:complete', function() { start() })
    .val('optionValue2')
		.trigger('change');
});

asyncTest('submitting form with data-remote attribute', 4, function() {
  $('form[data-remote]')
    .bind('ajax:success', function(e, data, status, xhr) { 
      App.assert_callback_invoked('ajax:success');
      App.assert_request_path(data, '/echo');
      equal(data.params.user_name, 'john', 'ajax arguments should have key user_name with right value');
      App.assert_post_request(data); 
    })
    .bind('ajax:complete', function() { start() })
    .trigger('submit');
});

asyncTest('form\'s submit bindings in browsers that don\'t support submit bubbling', 4, function() {
  var form = $('form[data-remote]'), directBindingCalled = false;

  ok(!directBindingCalled, 'nothing is called');

  form
    .append($('<input type="submit" />'))
    .bind('submit', function(){
      ok(true, 'binding handler is called');
      directBindingCalled = true;
    })
    .bind('ajax:beforeSend', function(){
      ok(true, 'form being submitted via ajax');
      ok(directBindingCalled, 'binding handler already called');
    })
    .bind('ajax:complete', function(){
      start();
    });

    if(!$.support.submitBubbles) {
      // Must indrectly submit form via click to trigger jQuery's manual submit bubbling in IE
      form.find('input[type=submit]')
      .trigger('click');
    } else {
      form.trigger('submit');
    }
});

asyncTest('returning false in form\'s submit bindings in non-submit-bubbling browsers', 1, function(){
  var form = $('form[data-remote]');

  form
    .append($('<input type="submit" />'))
    .bind('submit', function(){
      ok(true, 'binding handler is called');
      return false;
    })
    .bind('ajax:beforeSend', function(){
      ok(false, 'form should not be submitted');
    });

    if (!$.support.submitBubbles) {
      // Must indrectly submit form via click to trigger jQuery's manual submit bubbling in IE
      form.find('input[type=submit]').trigger('click');
    } else {
      form.trigger('submit');
    }

    setTimeout(function(){ start(); }, 13);
});
