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

asyncTest('1. clicking on a link with data-confirm attribute. Confirm yes.', 6, function() {
  var message;
  var $simpleDialog;

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

  // confirm
  $simpleDialog = $('.simple-dialog-confirm');
  message = $simpleDialog.find('.simple-dialog-content').text();
  $simpleDialog.find('.btn').first().click();

});

asyncTest('2. clicking on a button with data-confirm attribute. Confirm yes.', 6, function() {
  var message;
  var $simpleDialog;

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

  // confirm
  $simpleDialog = $('.simple-dialog-confirm');
  message = $simpleDialog.find('.simple-dialog-content').text();
  $simpleDialog.find('.btn').first().click();

});

asyncTest('3. clicking on a link with data-confirm attribute. Confirm No.', 3, function() {
  var message;
  var $simpleDialog;

  $('a[data-confirm]')
    .bind('confirm:complete', function(e, data) {
      App.assertCallbackInvoked('confirm:complete');
      ok(data == false, 'confirm:complete passes in confirm answer (false)');
    })
    .bind('ajax:beforeSend', function(e, data, status, xhr) {
      App.assertCallbackNotInvoked('ajax:beforeSend');
    })
    .trigger('click');

  // rejected
  $simpleDialog = $('.simple-dialog-confirm');
  message = $simpleDialog.find('.simple-dialog-content').text();
  $simpleDialog.find('.btn').last().click();

  setTimeout(function() {
    equal(message, 'Are you absolutely sure?');
    start();
  }, 50);
});

asyncTest('4. clicking on a button with data-confirm attribute. Confirm No.', 3, function() {
  var message;
  var $simpleDialog;

  $('button[data-confirm]')
    .bind('confirm:complete', function(e, data) {
      App.assertCallbackInvoked('confirm:complete');
      ok(data == false, 'confirm:complete passes in confirm answer (false)');
    })
    .bind('ajax:beforeSend', function(e, data, status, xhr) {
      App.assertCallbackNotInvoked('ajax:beforeSend');
    })
    .trigger('click');

  // rejected
  $simpleDialog = $('.simple-dialog-confirm');
  message = $simpleDialog.find('.simple-dialog-content').text();
  $simpleDialog.find('.btn').last().click();

  setTimeout(function() {
    equal(message, 'Are you absolutely sure?');
    start();
  }, 50);
});

asyncTest('5. clicking on a button with data-confirm attribute. Confirm error.', 3, function() {
  var message;
  var originConfirm = $.rails.confirm
  $.rails.confirm = function(m) {
    return new Promise(function(resolve, reject) {
      try {
        var dialog = simple.dialog.confirm({
          content: m,
          callback: function(e, yes) {
            resolve(yes);
          }
        });
        throw 'random exception';
      } catch(e) {
        resolve(false);
      }
    });
  }

  $('button[data-confirm]')
    .bind('confirm:complete', function(e, data) {
      App.assertCallbackInvoked('confirm:complete');
      ok(data == false, 'confirm:complete passes in confirm answer (false)');
    })
    .bind('ajax:beforeSend', function(e, data, status, xhr) {
      App.assertCallbackNotInvoked('ajax:beforeSend');
    })
    .trigger('click');

  $simpleDialog = $('.simple-dialog-confirm');
  message = $simpleDialog.find('.simple-dialog-content').text();

  setTimeout(function() {
    equal(message, 'Are you absolutely sure?');
    start();

    $.rails.confirm = originConfirm
  }, 50);
});

asyncTest('6. clicking on a submit button with form and data-confirm attributes. Confirm No.', 3, function() {
  var message;
  var $simpleDialog;

  $('input[type=submit][form]')
    .bind('confirm:complete', function(e, data) {
      App.assertCallbackInvoked('confirm:complete');
      ok(data == false, 'confirm:complete passes in confirm answer (false)');
    })
    .bind('ajax:beforeSend', function(e, data, status, xhr) {
      App.assertCallbackNotInvoked('ajax:beforeSend');
    })
    .trigger('click');

  // rejected
  $simpleDialog = $('.simple-dialog-confirm');
  message = $simpleDialog.find('.simple-dialog-content').text();
  $simpleDialog.find('.btn').last().click();

  setTimeout(function() {
    equal(message, 'Are you absolutely sure?');
    start();
  }, 50);
});

asyncTest('7. binding to confirm event of a link and returning false', 2, function() {
  $('a[data-confirm]')
    .bind('confirm', function() {
      App.assertCallbackInvoked('confirm');
      return false;
    })
    .bind('confirm:complete', function() {
      App.assertCallbackNotInvoked('confirm:complete');
    })
    .trigger('click');

  // simple.dialog.confirm should not be called
  equal(0, $('.simple-dialog-confirm').length);

  setTimeout(function() {
    start();
  }, 50);
});

asyncTest('8. binding to confirm event of a button and returning false', 2, function() {

  $('button[data-confirm]')
    .bind('confirm', function() {
      App.assertCallbackInvoked('confirm');
      return false;
    })
    .bind('confirm:complete', function() {
      App.assertCallbackNotInvoked('confirm:complete');
    })
    .trigger('click');

  // simple.dialog.confirm should not be called
  equal(0, $('.simple-dialog-confirm').length);

  setTimeout(function() {
    start();
  }, 50);
});

asyncTest('9. binding to confirm:complete event of a link and returning false', 2, function() {
  var $simpleDialog;

  $('a[data-confirm]')
    .bind('confirm:complete', function() {
      App.assertCallbackInvoked('confirm:complete');
      return false;
    })
    .bind('ajax:beforeSend', function() {
      App.assertCallbackNotInvoked('ajax:beforeSend');
    })
    .trigger('click');

  // confirm
  $simpleDialog = $('.simple-dialog-confirm');
  // simple.dialog.confirm should be called
  equal(1, $simpleDialog.length);

  $simpleDialog.find('.btn').first().click();

  setTimeout(function() {
    start();
  }, 50);
});

asyncTest('10. binding to confirm:complete event of a button and returning false', 2, function() {
  var $simpleDialog;

  $('button[data-confirm]')
    .bind('confirm:complete', function() {
      App.assertCallbackInvoked('confirm:complete');
      return false;
    })
    .bind('ajax:beforeSend', function() {
      App.assertCallbackNotInvoked('ajax:beforeSend');
    })
    .trigger('click');

  // confirm
  $simpleDialog = $('.simple-dialog-confirm');
  // simple.dialog.confirm should be called
  equal(1, $simpleDialog.length);

  $simpleDialog.find('.btn').first().click();

  setTimeout(function() {
    start();
  }, 50);
});

asyncTest('11. a button inside a form only confirms once', 1, function() {
  var confirmations = 0;

  $.rails.confirm = function(m) {
    confirmations += 1;
    return new Promise(function(resolve, reject) {
      try {
        var dialog = simple.dialog.confirm({
          content: m,
          callback: function(e, yes) {
            resolve(yes);
          }
        });
      } catch(e) {
        resolve(false);
      }
    });
  }

  $('#qunit-fixture').append($('<form />').append($('<button />', {
    'data-remote': 'true',
    'data-confirm': 'Are you absolutely sure?',
    text: 'Click me'
  })));

  $('form > button[data-confirm]').trigger('click');

  ok(confirmations === 1, 'confirmation counter should be 1, but it was ' + confirmations);
  start();
});
