module('data-disable', {
  setup: function() {
    $('#qunit-fixture').append($('<form />', {
      action: '/echo',
      'data-remote': 'true',
      method: 'post'
    }))
      .find('form')
      .append($('<input type="text" data-disable-with="processing ..." name="user_name" value="john" />'));

    $('#qunit-fixture').append($('<form />', {
      action: '/echo',
      method: 'post'
    }))
      .find('form:last')
      // WEEIRDD: the form won't submit to an iframe if the button is name="submit" (??!)
      .append($('<input type="submit" data-disable-with="submitting ..." name="submit2" value="Submit" />'));
  }
});

asyncTest('form input field with "data-disable-with" attribute', 7, function() {
  var form = $('form[data-remote]'), input = form.find('input[type=text]');

  function checkOriginalState() {
    ok(!input.is(':disabled'), 'input field should not be disabled');
    equal(input.val(), 'john', 'input field should have value given to it');
  }
  checkOriginalState();

  form.bind('ajax:success', function(e, data) {
    setTimeout(function() {
      checkOriginalState();
      equal(data.params.user_name, 'john');
      start();
    }, 13)
  })
  form.trigger('submit');

  ok(input.is(':disabled'), 'input field should be disabled');
  equal(input.val(), 'processing ...', 'input field should have disabled value given to it');
});

asyncTest('form submit button with "data-disable-with" attribute', 6, function(){
  var form = $('form:not([data-remote])'), input = form.find('input[type=submit]');

  ok(!input.is(':disabled'), 'input field should not be disabled');
  equal(input.val(), 'Submit', 'input field should have value given to it');

  function checkDisabledState() {
    ok(input.is(':disabled'), 'input field should be disabled');
    equal(input.val(), 'submitting ...');
  }

  // WEEIRDD: attaching this handler makes the test work in IE7
  form.bind('iframe:loading', function(e, form) {});

  form.bind('iframe:loaded', function(e, data) {
    setTimeout(function() {
      checkDisabledState();
      start();
    }, 30);
  }).trigger('submit');

  setTimeout(checkDisabledState, 30);
});
