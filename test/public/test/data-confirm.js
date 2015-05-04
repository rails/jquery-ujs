module('data-confirm', {
  setup: function() {
    $('#qunit-fixture').append($('<a />', {
      href: '/echo',
      'data-remote': 'true',
      'data-confirm': 'Are you absolutely sure?',
      text: 'my social security number'
    }));

    $('#qunit-fixture').append($('<button />', {
      'data-url': '/echo',
      'data-remote': 'true',
      'data-confirm': 'Are you absolutely sure?',
      text: 'Click me'
    }));

    $('#qunit-fixture').append($('<form />', {
      id: 'confirm',
      action: '/echo',
      'data-remote': 'true'
    }));

    $('#qunit-fixture').append($('<input />', {
      type: 'submit',
      form: 'confirm',
      'data-confirm': 'Are you absolutely sure?'
    }));

    this.windowConfirm = window.confirm;
  },
  teardown: function() {
    window.confirm = this.windowConfirm;
  }
});

asyncTest('clicking on a link with data-confirm attribute. Confirm yes.', 6, function() {
  var message;
  // auto-confirm:
  window.confirm = function(msg) { message = msg; return true };

  $('a[data-confirm]')
    .bind('confirm:complete', function(e, data) {
      App.assertCallbackInvoked('confirm:complete');
      ok(data == true, 'confirm:complete passes in confirm answer (true)');
    })
    .bind('ajax:success', function(e, data, status, xhr) {
      App.assertCallbackInvoked('ajax:success');
      App.assertRequestPath(data, '/echo');
      App.assertGetRequest(data);

      equal(message, 'Are you absolutely sure?');
      start();
    })
    .trigger('click');
});

asyncTest('clicking on a button with data-confirm attribute. Confirm yes.', 6, function() {
  var message;
  // auto-confirm:
  window.confirm = function(msg) { message = msg; return true };

  $('button[data-confirm]')
    .bind('confirm:complete', function(e, data) {
      App.assertCallbackInvoked('confirm:complete');
      ok(data == true, 'confirm:complete passes in confirm answer (true)');
    })
    .bind('ajax:success', function(e, data, status, xhr) {
      App.assertCallbackInvoked('ajax:success');
      App.assertRequestPath(data, '/echo');
      App.assertGetRequest(data);

      equal(message, 'Are you absolutely sure?');
      start();
    })
    .trigger('click');
});

asyncTest('clicking on a link with data-confirm attribute. Confirm No.', 3, function() {
  var message;
  // auto-decline:
  window.confirm = function(msg) { message = msg; return false };

  $('a[data-confirm]')
    .bind('confirm:complete', function(e, data) {
      App.assertCallbackInvoked('confirm:complete');
      ok(data == false, 'confirm:complete passes in confirm answer (false)');
    })
    .bind('ajax:beforeSend', function(e, data, status, xhr) {
      App.assertCallbackNotInvoked('ajax:beforeSend');
    })
    .trigger('click');

  setTimeout(function() {
    equal(message, 'Are you absolutely sure?');
    start();
  }, 50);
});

asyncTest('clicking on a button with data-confirm attribute. Confirm No.', 3, function() {
  var message;
  // auto-decline:
  window.confirm = function(msg) { message = msg; return false };

  $('button[data-confirm]')
    .bind('confirm:complete', function(e, data) {
      App.assertCallbackInvoked('confirm:complete');
      ok(data == false, 'confirm:complete passes in confirm answer (false)');
    })
    .bind('ajax:beforeSend', function(e, data, status, xhr) {
      App.assertCallbackNotInvoked('ajax:beforeSend');
    })
    .trigger('click');

  setTimeout(function() {
    equal(message, 'Are you absolutely sure?');
    start();
  }, 50);
});

asyncTest('clicking on a button with data-confirm attribute. Confirm error.', 3, function() {
  var message;
  // auto-decline:
  window.confirm = function(msg) { message = msg; throw "some random error"; };

  $('button[data-confirm]')
    .bind('confirm:complete', function(e, data) {
      App.assertCallbackInvoked('confirm:complete');
      ok(data == false, 'confirm:complete passes in confirm answer (false)');
    })
    .bind('ajax:beforeSend', function(e, data, status, xhr) {
      App.assertCallbackNotInvoked('ajax:beforeSend');
    })
    .trigger('click');

  setTimeout(function() {
    equal(message, 'Are you absolutely sure?');
    start();
  }, 50);
});

asyncTest('clicking on a submit button with form and data-confirm attributes. Confirm No.', 3, function() {
  var message;
  // auto-decline:
  window.confirm = function(msg) { message = msg; return false };

  $('input[type=submit][form]')
    .bind('confirm:complete', function(e, data) {
      App.assertCallbackInvoked('confirm:complete');
      ok(data == false, 'confirm:complete passes in confirm answer (false)');
    })
    .bind('ajax:beforeSend', function(e, data, status, xhr) {
      App.assertCallbackNotInvoked('ajax:beforeSend');
    })
    .trigger('click');

  setTimeout(function() {
    equal(message, 'Are you absolutely sure?');
    start();
  }, 50);
});

asyncTest('binding to confirm event of a link and returning false', 1, function() {
  // redefine confirm function so we can make sure it's not called
  window.confirm = function(msg) {
    ok(false, 'confirm dialog should not be called');
  };

  $('a[data-confirm]')
    .bind('confirm', function() {
      App.assertCallbackInvoked('confirm');
      return false;
    })
    .bind('confirm:complete', function() {
      App.assertCallbackNotInvoked('confirm:complete');
    })
    .trigger('click');

  setTimeout(function() {
    start();
  }, 50);
});

asyncTest('binding to confirm event of a button and returning false', 1, function() {
  // redefine confirm function so we can make sure it's not called
  window.confirm = function(msg) {
    ok(false, 'confirm dialog should not be called');
  };

  $('button[data-confirm]')
    .bind('confirm', function() {
      App.assertCallbackInvoked('confirm');
      return false;
    })
    .bind('confirm:complete', function() {
      App.assertCallbackNotInvoked('confirm:complete');
    })
    .trigger('click');

  setTimeout(function() {
    start();
  }, 50);
});

asyncTest('binding to confirm:complete event of a link and returning false', 2, function() {
  // auto-confirm:
  window.confirm = function(msg) {
    ok(true, 'confirm dialog should be called');
    return true;
  };

  $('a[data-confirm]')
    .bind('confirm:complete', function() {
      App.assertCallbackInvoked('confirm:complete');
      return false;
    })
    .bind('ajax:beforeSend', function() {
      App.assertCallbackNotInvoked('ajax:beforeSend');
    })
    .trigger('click');

  setTimeout(function() {
    start();
  }, 50);
});

asyncTest('binding to confirm:complete event of a button and returning false', 2, function() {
  // auto-confirm:
  window.confirm = function(msg) {
    ok(true, 'confirm dialog should be called');
    return true;
  };

  $('button[data-confirm]')
    .bind('confirm:complete', function() {
      App.assertCallbackInvoked('confirm:complete');
      return false;
    })
    .bind('ajax:beforeSend', function() {
      App.assertCallbackNotInvoked('ajax:beforeSend');
    })
    .trigger('click');

  setTimeout(function() {
    start();
  }, 50);
});

asyncTest('a button inside a form only confirms once', 1, function() {
  var confirmations = 0;
  window.confirm = function(msg) {
    confirmations++;
    return true;
  };

  $('#qunit-fixture').append($('<form />').append($('<button />', {
    'data-remote': 'true',
    'data-confirm': 'Are you absolutely sure?',
    text: 'Click me'
  })));

  $('form > button[data-confirm]').trigger('click');

  ok(confirmations === 1, 'confirmation counter should be 1, but it was ' + confirmations);
  start();
});
