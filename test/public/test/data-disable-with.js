module('data-disable-with', {
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
      method: 'post',
      id: 'not_remote'
    }))
      .find('form:last')
      // WEEIRDD: the form won't submit to an iframe if the button is name="submit" (??!)
      .append($('<input type="submit" data-disable-with="submitting ..." name="submit2" value="Submit" />'));

    $('#qunit-fixture').append($('<a />', {
      text: 'Click me',
      href: '/echo',
      'data-disable-with': 'clicking...'
    }));


    $('#qunit-fixture').append($('<input />', {
      type: 'submit',
      form: 'not_remote',
      'data-disable-with': 'form attr submitting',
      name: 'submit3',
      value: 'Form Attr Submit'
    }));

    $('#qunit-fixture').append($('<button />', {
      text: 'Click me',
      'data-remote': true,
      'data-url': '/echo',
      'data-disable-with': 'clicking...'
    }));
  },
  teardown: function() {
    $(document).unbind('iframe:loaded');
  }
});

asyncTest('form input field with "data-disable-with" attribute', 7, function() {
  var form = $('form[data-remote]'), input = form.find('input[type=text]');

  App.checkEnabledState(input, 'john');

  form.bind('ajax:success', function(e, data) {
    setTimeout(function() {
      App.checkEnabledState(input, 'john');
      equal(data.params.user_name, 'john');
      start();
    }, 13);
  });
  form.trigger('submit');

  App.checkDisabledState(input, 'processing ...');
});

asyncTest('blank form input field with "data-disable-with" attribute', 7, function() {
  var form = $('form[data-remote]'), input = form.find('input[type=text]');

  input.val('');
  App.checkEnabledState(input, '');

  form.bind('ajax:success', function(e, data) {
    setTimeout(function() {
      App.checkEnabledState(input, '');
      equal(data.params.user_name, '');
      start();
    }, 13);
  });
  form.trigger('submit');

  App.checkDisabledState(input, 'processing ...');
});

asyncTest('form button with "data-disable-with" attribute', 6, function() {
  var form = $('form[data-remote]'), button = $('<button data-disable-with="submitting ..." name="submit2">Submit</button>');
  form.append(button);

  App.checkEnabledState(button, 'Submit');

  form.bind('ajax:success', function(e, data) {
    setTimeout(function() {
      App.checkEnabledState(button, 'Submit');
      start();
    }, 13);
  });
  form.trigger('submit');

  App.checkDisabledState(button, 'submitting ...');
});

asyncTest('form input[type=submit][data-disable-with] disables', 6, function(){
  var form = $('form:not([data-remote])'), input = form.find('input[type=submit]');

  App.checkEnabledState(input, 'Submit');

  // WEEIRDD: attaching this handler makes the test work in IE7
  $(document).bind('iframe:loading', function(e, form) {});

  $(document).bind('iframe:loaded', function(e, data) {
    setTimeout(function() {
      App.checkDisabledState(input, 'submitting ...');
      start();
    }, 30);
  });
  form.trigger('submit');

  setTimeout(function() {
    App.checkDisabledState(input, 'submitting ...');
  }, 30);
});

test('form input[type=submit][data-disable-with] re-enables when `pageshow` event is triggered', function(){
  var form = $('form:not([data-remote])'), input = form.find('input[type=submit]');

  App.checkEnabledState(input, 'Submit');

  // Emulate the disabled state without submitting the form at all, what is the
  // state after going back on firefox after submitting a form.
  //
  // See https://github.com/rails/jquery-ujs/issues/357
  $.rails.disableFormElements(form);

  App.checkDisabledState(input, 'submitting ...');

  $(window).trigger('pageshow');

  App.checkEnabledState(input, 'Submit');
});

asyncTest('form[data-remote] input[type=submit][data-disable-with] is replaced in ajax callback', 2, function(){
  var form = $('form:not([data-remote])').attr('data-remote', 'true'), origFormContents = form.html();

  form.bind('ajax:success', function(){
    form.html(origFormContents);

    setTimeout(function(){
      var input = form.find('input[type=submit]');
      App.checkEnabledState(input, 'Submit');
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
      App.checkEnabledState(newDisabledInput, 'Submit');
      start();
    }, 30);
  }).trigger('submit');
});

asyncTest('form input[type=submit][data-disable-with] using "form" attribute disables', 6, function() {
  var form = $('#not_remote'), input = $('input[form=not_remote]');
  App.checkEnabledState(input, 'Form Attr Submit');

  // WEEIRDD: attaching this handler makes the test work in IE7
  $(document).bind('iframe:loading', function(e, form) {});

  $(document).bind('iframe:loaded', function(e, data) {
    setTimeout(function() {
      App.checkDisabledState(input, 'form attr submitting');
      start();
    }, 30);
  });
  form.trigger('submit');

  setTimeout(function() {
    App.checkDisabledState(input, 'form attr submitting');
  }, 30);

});

asyncTest('form[data-remote] textarea[data-disable-with] attribute', 3, function() {
  var form = $('form[data-remote]'),
      textarea = $('<textarea data-disable-with="processing ..." name="user_bio">born, lived, died.</textarea>').appendTo(form);

  form.bind('ajax:success', function(e, data) {
    setTimeout(function() {
      equal(data.params.user_bio, 'born, lived, died.');
      start();
    }, 13);
  });
  form.trigger('submit');

  App.checkDisabledState(textarea, 'processing ...');
});

asyncTest('a[data-disable-with] disables', 4, function() {
  var link = $('a[data-disable-with]');

  App.checkEnabledState(link, 'Click me');

  link.trigger('click');
  App.checkDisabledState(link, 'clicking...');
  start();
});

test('a[data-disable-with] re-enables when `pageshow` event is triggered', function() {
  var link = $('a[data-disable-with]');

  App.checkEnabledState(link, 'Click me');

  link.trigger('click');
  App.checkDisabledState(link, 'clicking...');

  $(window).trigger('pageshow');
  App.checkEnabledState(link, 'Click me');
});

asyncTest('a[data-remote][data-disable-with] disables and re-enables', 6, function() {
  var link = $('a[data-disable-with]').attr('data-remote', true);

  App.checkEnabledState(link, 'Click me');

  link
    .bind('ajax:beforeSend', function() {
      App.checkDisabledState(link, 'clicking...');
    })
    .bind('ajax:complete', function() {
      setTimeout( function() {
        App.checkEnabledState(link, 'Click me');
        start();
      }, 15);
    })
    .trigger('click');
});

asyncTest('a[data-remote][data-disable-with] re-enables when `ajax:before` event is cancelled', 6, function() {
  var link = $('a[data-disable-with]').attr('data-remote', true);

  App.checkEnabledState(link, 'Click me');

  link
    .bind('ajax:before', function() {
      App.checkDisabledState(link, 'clicking...');
      return false;
    })
    .trigger('click');

  setTimeout(function() {
    App.checkEnabledState(link, 'Click me');
    start();
  }, 30);
});

asyncTest('a[data-remote][data-disable-with] re-enables when `ajax:beforeSend` event is cancelled', 6, function() {
  var link = $('a[data-disable-with]').attr('data-remote', true);

  App.checkEnabledState(link, 'Click me');

  link
    .bind('ajax:beforeSend', function() {
      App.checkDisabledState(link, 'clicking...');
      return false;
    })
    .trigger('click');

  setTimeout(function() {
    App.checkEnabledState(link, 'Click me');
    start();
  }, 30);
});

asyncTest('a[data-remote][data-disable-with] re-enables when `ajax:error` event is triggered', 6, function() {
  var link = $('a[data-disable-with]').attr('data-remote', true).attr('href', '/error');

  App.checkEnabledState(link, 'Click me');

  link
    .bind('ajax:beforeSend', function() {
      App.checkDisabledState(link, 'clicking...');
    })
    .trigger('click');

  setTimeout(function() {
    App.checkEnabledState(link, 'Click me');
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

  App.checkEnabledState(input, 'john');
  App.checkEnabledState(button, 'Submit');
  App.checkEnabledState(textarea, 'born, lived, died.');
  App.checkEnabledState(submit, 'Submit');

  start();
});

asyncTest('ctrl-clicking on a link does not disables the link', 6, function() {
  var link = $('a[data-disable-with]'), e;
  e = $.Event('click');
  e.metaKey = true;

  App.checkEnabledState(link, 'Click me');

  link.trigger(e);
  App.checkEnabledState(link, 'Click me');

  e = $.Event('click');
  e.ctrlKey = true;

  link.trigger(e);
  App.checkEnabledState(link, 'Click me');
  start();
});

asyncTest('button[data-remote][data-disable-with] disables and re-enables', 6, function() {
  var button = $('button[data-remote][data-disable-with]');

  App.checkEnabledState(button, 'Click me');

  button
    .bind('ajax:send', function() {
      App.checkDisabledState(button, 'clicking...');
    })
    .bind('ajax:complete', function() {
      setTimeout( function() {
        App.checkEnabledState(button, 'Click me');
        start();
      }, 15);
    })
    .trigger('click');
});

asyncTest('button[data-remote][data-disable-with] re-enables when `ajax:before` event is cancelled', 6, function() {
  var button = $('button[data-remote][data-disable-with]');

  App.checkEnabledState(button, 'Click me');

  button
    .bind('ajax:before', function() {
      App.checkDisabledState(button, 'clicking...');
      return false;
    })
    .trigger('click');

  setTimeout(function() {
    App.checkEnabledState(button, 'Click me');
    start();
  }, 30);
});

asyncTest('button[data-remote][data-disable-with] re-enables when `ajax:beforeSend` event is cancelled', 6, function() {
  var button = $('button[data-remote][data-disable-with]');

  App.checkEnabledState(button, 'Click me');

  button
    .bind('ajax:beforeSend', function() {
      App.checkDisabledState(button, 'clicking...');
      return false;
    })
    .trigger('click');

  setTimeout(function() {
    App.checkEnabledState(button, 'Click me');
    start();
  }, 30);
});

asyncTest('button[data-remote][data-disable-with] re-enables when `ajax:error` event is triggered', 6, function() {
  var button = $('a[data-disable-with]').attr('data-remote', true).attr('href', '/error');

  App.checkEnabledState(button, 'Click me');

  button
    .bind('ajax:send', function() {
      App.checkDisabledState(button, 'clicking...');
    })
    .trigger('click');

  setTimeout(function() {
    App.checkEnabledState(button, 'Click me');
    start();
  }, 30);
});
