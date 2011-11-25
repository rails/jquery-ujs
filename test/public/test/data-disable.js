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

    $('#qunit-fixture').append($('<a />', {
      text: 'Click me',
      href: '/echo',
      'data-disable-with': 'clicking...'
    }));
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

asyncTest('form button with "data-disable-with" attribute', 6, function() {
  var form = $('form[data-remote]'), button = $('<button data-disable-with="submitting ..." name="submit2">Submit</button>');
  form.append(button);

  function checkOriginalState() {
    ok(!button.is(':disabled'), 'button should not be disabled');
    equal(button.text(), 'Submit', 'button should have original value');
  }
  checkOriginalState();

  form.bind('ajax:success', function(e, data) {
    setTimeout(function() {
      checkOriginalState();
      start();
    }, 13)
  })
  form.trigger('submit');

  ok(button.is(':disabled'), 'button should be disabled');
  equal(button.text(), 'submitting ...', 'button should have disabled value');
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

asyncTest('form with input[type=submit][data-disable-with] is replaced in ajax callback', 2, function(){
  var form = $('form:not([data-remote])').attr('data-remote', 'true'), origFormContents = form.html();

  form.bind('ajax:success', function(){
    form.html(origFormContents);

    setTimeout(function(){
      var input = form.find('input[type=submit]');
      ok(!input.is(':disabled'), 'new input field should not be disabled');
      equal(input.val(), 'Submit', 'new input field should not have value replaced by "enable" function');

      start();
    }, 30);
  }).trigger('submit');
});

asyncTest('form with input[data-disable-with] is replaced with disabled field in ajax callback', 2, function(){
  var form = $('form:not([data-remote])').attr('data-remote', 'true'), input = form.find('input[type=submit]'),
      newDisabledInput = input.clone().attr('disabled', 'disabled');

  form.bind('ajax:success', function(){
    input.replaceWith(newDisabledInput);

    setTimeout(function(){
      ok(!newDisabledInput.is(':disabled'), 'new input field should not be disabled');
      equal(newDisabledInput.val(), 'Submit', 'new input field should not have value replaced if "ujs:enable-with" is blank');

      start();
    }, 30);
  }).trigger('submit');
});

asyncTest('form textarea with "data-disable-with" attribute', 3, function() {
  var form = $('form[data-remote]'),
      textarea = $('<textarea data-disable-with="processing ..." name="user_bio">born, lived, died.</textarea>').appendTo(form);

  form.bind('ajax:success', function(e, data) {
    setTimeout(function() {
      equal(data.params.user_bio, 'born, lived, died.');
      start();
    }, 13)
  })
  form.trigger('submit');

  ok(textarea.is(':disabled'), 'textarea should be disabled');
  equal(textarea.val(), 'processing ...', 'textarea should have disabled value given to it');
});

asyncTest('link with "data-disable-with" attribute disables', 4, function() {
  var link = $('a[data-disable-with]');

  ok(!link.data('ujs:enable-with'), 'link should not be disabled');
  equal(link.html(), 'Click me', 'link should have value given to it');

  function checkDisabledLink() {
    ok(link.data('ujs:enable-with'), 'link should be disabled');
    equal(link.html(), 'clicking...');
  }

  link.trigger('click');
  checkDisabledLink();
  start();
});

asyncTest('remote link with "data-disable-with" attribute disables and re-enables', 6, function() {
  var link = $('a[data-disable-with]').attr('data-remote', true);

  function checkEnabledLink() {
    ok(!link.data('ujs:enable-with'), 'link should not be disabled');
    equal(link.html(), 'Click me', 'link should have value given to it');
  }
  checkEnabledLink();

  function checkDisabledLink() {
    ok(link.data('ujs:enable-with'), 'link should be disabled');
    equal(link.html(), 'clicking...');
  }

  link
    .bind('ajax:beforeSend', function() {
      checkDisabledLink();
    })
    .live('ajax:complete', function() {
      checkEnabledLink();
      start();
    })
    .trigger('click');
});

asyncTest('remote link with "data-disable-with" attribute disables and re-enables when ajax:before event is cancelled', 6, function() {
  var link = $('a[data-disable-with]').attr('data-remote', true);

  function checkEnabledLink() {
    ok(!link.data('ujs:enable-with'), 'link should not be disabled');
    equal(link.html(), 'Click me', 'link should have value given to it');
  }
  checkEnabledLink();

  function checkDisabledLink() {
    ok(link.data('ujs:enable-with'), 'link should be disabled');
    equal(link.html(), 'clicking...');
  }

  link
    .bind('ajax:before', function() {
      checkDisabledLink();
      return false;
    })
    .trigger('click');
    setTimeout(function() {
      checkEnabledLink();
      start();
    }, 30);
});

asyncTest('remote link with "data-disable-with" attribute disables and re-enables when ajax:beforeSend event is cancelled', 6, function() {
  var link = $('a[data-disable-with]').attr('data-remote', true);

  function checkEnabledLink() {
    ok(!link.data('ujs:enable-with'), 'link should not be disabled');
    equal(link.html(), 'Click me', 'link should have value given to it');
  }
  checkEnabledLink();

  function checkDisabledLink() {
    ok(link.data('ujs:enable-with'), 'link should be disabled');
    equal(link.html(), 'clicking...');
  }

  link
    .bind('ajax:beforeSend', function() {
      checkDisabledLink();
      return false;
    })
    .trigger('click');
    setTimeout(function() {
      checkEnabledLink();
      start();
    }, 30);
});
