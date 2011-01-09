module('data-disable', {

  teardown: App.teardown,
  setup: function() {

    $('#fixtures').append($('<form />', {
      action: '/echo',
      'data-remote': 'true',
      method: 'post'
    }));

    $('form').append($('<input />', {
      id: 'user_name',
      'data-disable-with': 'processing ...',
      type: 'text',
      size: '30',
      'name': 'user_name',
      'value': 'john'
    }));

    $('#fixtures').append($('<form />', {
      action: '/echo',
      method: 'post'
    }));

    $('form:not([data-remote])').append($('<input />', {
      id: 'submit',
      'data-disable-with': 'submitting ...',
      type: 'submit',
      name: 'submit',
      value: 'Submit'
    }));

  }
});

test('triggering ajax callbacks on a form with data-disable attribute', function() {
  expect(6);
  var form = $('form[data-remote]'), input = form.find('input[type=text]');

  ok(!input.is(':disabled'), 'input field should not be disabled');
  equals(input.val(), 'john', 'input field should have value given to it');

  form.trigger('ajax:beforeSend');

  ok(input.is(':disabled'), 'input field should be disabled');
  equals(input.val(), 'processing ...', 'input field should have disabled value given to it');

  form.trigger('ajax:complete');

  ok(!input.is(':disabled'), 'input field should not be disabled');
  equals(input.val(), 'john', 'input field should have value given to it');
});

test('clicking on non-ajax Submit input tag with data-disable-with attribute', function(){
  expect(4);
  var form = $('form:not([data-remote])'), input = form.find('input[type=submit]');

  ok(!input.is(':disabled'), 'input field should not be disabled');
  equals(input.val(), 'Submit', 'input field should have value given to it');

  $('form:not([data-remote])').live('submit', function(e) {
    // prevent the submit navigating away from the test suite
    e.preventDefault();
  }).trigger('submit');

  ok(input.is(':disabled'), 'input field should not be disabled');
  equals(input.val(), 'submitting ...', 'input field should have disabled value given to it');
});
