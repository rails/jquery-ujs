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
  },
  teardown: function() {
    $(document).unbind('iframe:loaded');
  }
});

function getVal(el) {
  return el.is('input,textarea,select') ? el.val() : el.text();
}

function disabled(el) {
  return el.is('input,textarea,select,button') ? el.is(':disabled') : el.data('ujs:enable-with');
}

function checkEnabledState(el, text) {
  ok(!disabled(el), el.get(0).tagName + ' should not be disabled');
  equal(getVal(el), text, el.get(0).tagName + ' text should be original value');
}

function checkDisabledState(el, text) {
  ok(disabled(el), el.get(0).tagName + ' should be disabled');
  equal(getVal(el), text, el.get(0).tagName + ' text should be disabled value');
}

asyncTest('form input field with "data-disable-with" attribute', 7, function() {
  var form = $('form[data-remote]'), input = form.find('input[type=text]');

  checkEnabledState(input, 'john');

  form.bind('ajax:success', function(e, data) {
    setTimeout(function() {
      checkEnabledState(input, 'john');
      equal(data.params.user_name, 'john');
      start();
    }, 13)
  })
  form.trigger('submit');

  checkDisabledState(input, 'processing ...');
});

asyncTest('form button with "data-disable-with" attribute', 6, function() {
  var form = $('form[data-remote]'), button = $('<button data-disable-with="submitting ..." name="submit2">Submit</button>');
  form.append(button);

  checkEnabledState(button, 'Submit');

  form.bind('ajax:success', function(e, data) {
    setTimeout(function() {
      checkEnabledState(button, 'Submit');
      start();
    }, 13)
  })
  form.trigger('submit');

  checkDisabledState(button, 'submitting ...');
});

asyncTest('form input[type=submit][data-disable-with] disables', 6, function(){
  var form = $('form:not([data-remote])'), input = form.find('input[type=submit]');

  checkEnabledState(input, 'Submit');

  // WEEIRDD: attaching this handler makes the test work in IE7
  $(document).bind('iframe:loading', function(e, form) {});

  $(document).bind('iframe:loaded', function(e, data) {
    setTimeout(function() {
      checkDisabledState(input, 'submitting ...');
      start();
    }, 30);
  });
  form.trigger('submit');

  setTimeout(function() {
    checkDisabledState(input, 'submitting ...');
  }, 30);
});

asyncTest('form[data-remote] input[type=submit][data-disable-with] is replaced in ajax callback', 2, function(){
  var form = $('form:not([data-remote])').attr('data-remote', 'true'), origFormContents = form.html();

  form.bind('ajax:success', function(){
    form.html(origFormContents);

    setTimeout(function(){
      var input = form.find('input[type=submit]');
      checkEnabledState(input, 'Submit');
      start();
    }, 30);
  }).trigger('submit');
});

asyncTest('form[data-remote] input[data-disable-with] is replaced with disabled field in ajax callback', 2, function(){
  var form = $('form:not([data-remote])').attr('data-remote', 'true'), input = form.find('input[type=submit]'),
      newDisabledInput = input.clone().attr('disabled', 'disabled');

  form.bind('ajax:success', function(){
    input.replaceWith(newDisabledInput);

    setTimeout(function(){
      checkEnabledState(newDisabledInput, 'Submit');
      start();
    }, 30);
  }).trigger('submit');
});

asyncTest('form[data-remote] textarea[data-disable-with] attribute', 3, function() {
  var form = $('form[data-remote]'),
      textarea = $('<textarea data-disable-with="processing ..." name="user_bio">born, lived, died.</textarea>').appendTo(form);

  form.bind('ajax:success', function(e, data) {
    setTimeout(function() {
      equal(data.params.user_bio, 'born, lived, died.');
      start();
    }, 13)
  })
  form.trigger('submit');

  checkDisabledState(textarea, 'processing ...');
});

asyncTest('a[data-disable-with] disables', 4, function() {
  var link = $('a[data-disable-with]');

  checkEnabledState(link, 'Click me');

  link.trigger('click');
  checkDisabledState(link, 'clicking...');
  start();
});

asyncTest('a[data-remote][data-disable-with] disables and re-enables', 6, function() {
  var link = $('a[data-disable-with]').attr('data-remote', true);

  checkEnabledState(link, 'Click me');

  link
    .bind('ajax:beforeSend', function() {
      checkDisabledState(link, 'clicking...');
    })
    .bind('ajax:complete', function() {
      setTimeout( function() {
        checkEnabledState(link, 'Click me');
        start();
      }, 15);
    })
    .trigger('click');
});

asyncTest('a[data-remote][data-disable-with] re-enables when `ajax:before` event is cancelled', 6, function() {
  var link = $('a[data-disable-with]').attr('data-remote', true);

  checkEnabledState(link, 'Click me');

  link
    .bind('ajax:before', function() {
      checkDisabledState(link, 'clicking...');
      return false;
    })
    .trigger('click');

  setTimeout(function() {
    checkEnabledState(link, 'Click me');
    start();
  }, 30);
});

asyncTest('a[data-remote][data-disable-with] re-enables when `ajax:beforeSend` event is cancelled', 6, function() {
  var link = $('a[data-disable-with]').attr('data-remote', true);

  checkEnabledState(link, 'Click me');

  link
    .bind('ajax:beforeSend', function() {
      checkDisabledState(link, 'clicking...');
      return false;
    })
    .trigger('click');

  setTimeout(function() {
    checkEnabledState(link, 'Click me');
    start();
  }, 30);
});

asyncTest('a[data-remote][data-disable-with] re-enables when `ajax:error` event is triggered', 6, function() {
  var link = $('a[data-disable-with]').attr('data-remote', true).attr('href', '/error');

  checkEnabledState(link, 'Click me');

  link
    .bind('ajax:beforeSend', function() {
      checkDisabledState(link, 'clicking...');
    })
    .trigger('click');

  setTimeout(function() {
    checkEnabledState(link, 'Click me');
    start();
  }, 30);
});

asyncTest('form[data-remote] input|button|textarea[data-disable-with] does not disable when `ajax:beforeSend` event is cancelled', 8, function() {
  var form = $('form[data-remote]'),
      input = form.find('input:text'),
      button = $('<button data-disable-with="submitting ..." name="submit2">Submit</button>').appendTo(form),
      textarea = $('<textarea data-disable-with="processing ..." name="user_bio">born, lived, died.</textarea>').appendTo(form),
      submit = $('<input type="submit" data-disable-with="submitting ..." name="submit2" value="Submit" />').appendTo(form);

  form
    .bind('ajax:beforeSend', function() {
      return false;
    })
    .trigger('submit');

  checkEnabledState(input, 'john');
  checkEnabledState(button, 'Submit');
  checkEnabledState(textarea, 'born, lived, died.');
  checkEnabledState(submit, 'Submit');

  start();

});
