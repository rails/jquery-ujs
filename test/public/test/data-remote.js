module('data-remote', {
  setup: function() {
    $('#qunit-fixture')
      .append($('<a />', {
        href: '/echo',
        'data-remote': 'true',
        'data-params': 'data1=value1&data2=value2',
        text: 'my address'
      }))
      .append($('<button />', {
        'data-url': '/echo',
        'data-remote': 'true',
        'data-params': 'data1=value1&data2=value2',
        text: 'my button'
      }))
      .append($('<form />', {
        action: '/echo',
        'data-remote': 'true',
        method: 'post',
        id: 'my-remote-form'
      }))
      .append($('<a />', {
        href: '/echo',
        'data-remote': 'true',
        disabled: 'disabled',
        text: 'Disabed link'
      }))
      .find('form').append($('<input type="text" name="user_name" value="john">'));

  }
});

asyncTest('ctrl-clicking on a link does not fire ajaxyness', 0, function() {
  var link = $('a[data-remote]'), e;

  // Ideally, we'd setup an iframe to intercept normal link clicks
  // and add a test to make sure the iframe:loaded event is triggered.
  // However, jquery doesn't actually cause a native `click` event and
  // follow links using `trigger('click')`, it only fires bindings.
  link
    .removeAttr('data-params')
    .bind('ajax:beforeSend', function() {
      ok(false, 'ajax should not be triggered');
    });

  e = $.Event('click');
  e.metaKey = true;
  link.trigger(e);

  e = $.Event('click');
  e.ctrlKey = true;
  link.trigger(e);

  setTimeout(function(){ start(); }, 13);
});

asyncTest('ctrl-clicking on a link still fires ajax for non-GET links and for links with "data-params"', 2, function() {
  var link = $('a[data-remote]'), e;
  e = $.Event('click');
  e.metaKey = true;

  link
    .removeAttr('data-params')
    .attr('data-method', 'POST')
    .bind('ajax:beforeSend', function() {
      ok(true, 'ajax should be triggered');
    })
    .trigger(e);

  e = $.Event('click');
  e.metaKey = true;

  link
    .removeAttr('data-method')
    .attr('data-params', 'name=steve')
    .trigger(e);

  setTimeout(function(){ start(); }, 13);
});

asyncTest('clicking on a link with data-remote attribute', 5, function() {
  $('a[data-remote]')
    .bind('ajax:success', function(e, data, status, xhr) {
      App.assertCallbackInvoked('ajax:success');
      App.assertRequestPath(data, '/echo');
      equal(data.params.data1, 'value1', 'ajax arguments should have key data1 with right value');
      equal(data.params.data2, 'value2', 'ajax arguments should have key data2 with right value');
      App.assertGetRequest(data);
    })
    .bind('ajax:complete', function() { start() })
    .trigger('click');
});

asyncTest('clicking on a link with disabled attribute', 0, function() {
  $('a[disabled]')
  .bind("ajax:before", function(e, data, status, xhr) {
    App.assertCallbackNotInvoked('ajax:success')
  })
  .bind('ajax:complete', function() { start() })
  .trigger('click')

  setTimeout(function() {
    start();
  }, 13);
});

asyncTest('clicking on a button with data-remote attribute', 5, function() {
  $('button[data-remote]')
    .bind('ajax:success', function(e, data, status, xhr) {
      App.assertCallbackInvoked('ajax:success');
      App.assertRequestPath(data, '/echo');
      equal(data.params.data1, 'value1', 'ajax arguments should have key data1 with right value');
      equal(data.params.data2, 'value2', 'ajax arguments should have key data2 with right value');
      App.assertGetRequest(data);
    })
    .bind('ajax:complete', function() { start() })
    .trigger('click');
});

asyncTest('changing a select option with data-remote attribute', 5, function() {
  $('form')
    .append(
      $('<select />', {
        'name': 'user_data',
        'data-remote': 'true',
        'data-params': 'data1=value1',
        'data-url': '/echo'
      })
      .append($('<option />', {value: 'optionValue1', text: 'option1'}))
      .append($('<option />', {value: 'optionValue2', text: 'option2'}))
    );

  $('select[data-remote]')
    .bind('ajax:success', function(e, data, status, xhr) {
      App.assertCallbackInvoked('ajax:success');
      App.assertRequestPath(data, '/echo');
      equal(data.params.user_data, 'optionValue2', 'ajax arguments should have key term with right value');
      equal(data.params.data1, 'value1', 'ajax arguments should have key data1 with right value');
      App.assertGetRequest(data);
    })
    .bind('ajax:complete', function() { start() })
    .val('optionValue2')
    .trigger('change');
});

asyncTest('submitting form with data-remote attribute', 4, function() {
  $('form[data-remote]')
    .bind('ajax:success', function(e, data, status, xhr) {
      App.assertCallbackInvoked('ajax:success');
      App.assertRequestPath(data, '/echo');
      equal(data.params.user_name, 'john', 'ajax arguments should have key user_name with right value');
      App.assertPostRequest(data);
    })
    .bind('ajax:complete', function() { start() })
    .trigger('submit');
});

asyncTest('submitting form with data-remote attribute should include inputs in a fieldset only once', 3, function() {
  $('form[data-remote]')
    .append('<fieldset><input name="items[]" value="Item" /></fieldset>')
    .bind('ajax:success', function(e, data, status, xhr) {
      App.assertCallbackInvoked('ajax:success');
      equal(data.params.items.length, 1, 'ajax arguments should only have the item once')
      App.assertPostRequest(data);
    })
    .bind('ajax:complete', function() {
      $('form[data-remote], fieldset').remove()
      start()
    })
    .trigger('submit');
});

asyncTest('submitting form with data-remote attribute submits input with matching [form] attribute', 5, function() {
  $('#qunit-fixture')
    .append($('<input type="text" name="user_data" value="value1" form="my-remote-form">'));

  $('form[data-remote]')
    .bind('ajax:success', function(e, data, status, xhr) {
      App.assertCallbackInvoked('ajax:success');
      App.assertRequestPath(data, '/echo');
      equal(data.params.user_name, 'john', 'ajax arguments should have key user_name with right value');
      equal(data.params.user_data, 'value1', 'ajax arguments should have key user_data with right value');
      App.assertPostRequest(data);
    })
    .bind('ajax:complete', function() { start() })
    .trigger('submit');
});

asyncTest('submitting form with data-remote attribute by clicking button with matching [form] attribute', 5, function() {
  $('form[data-remote]')
    .bind('ajax:success', function(e, data, status, xhr) {
      App.assertCallbackInvoked('ajax:success');
      App.assertRequestPath(data, '/echo');
      equal(data.params.user_name, 'john', 'ajax arguments should have key user_name with right value');
      equal(data.params.user_data, 'value2', 'ajax arguments should have key user_data with right value');
      App.assertPostRequest(data);
    })
    .bind('ajax:complete', function() { start() });

  $('<button />', {
        type: "submit",
        name: "user_data",
        value: "value1",
        form: "my-remote-form"
      })
    .appendTo($('#qunit-fixture'));

  $('<button />', {
      type: "submit",
      name: "user_data",
      value: "value2",
      form: "my-remote-form"
    })
    .appendTo($('#qunit-fixture'))
    .trigger('click');
});

asyncTest('form\'s submit bindings in browsers that don\'t support submit bubbling', 5, function() {
  var form = $('form[data-remote]'), directBindingCalled = false;

  ok(!directBindingCalled, 'nothing is called');

  form
    .append($('<input type="submit" />'))
    .bind('submit', function(event){
      ok(event.type == 'submit', 'submit event handlers are called with submit event');
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

asyncTest('clicking on a link with falsy "data-remote" attribute does not fire ajaxyness', 0, function() {
  $('a[data-remote]')
    .attr('data-remote', 'false')
    .bind('ajax:beforeSend', function() {
      ok(false, 'ajax should not be triggered');
    })
    .bind('click', function() {
      return false;
    })
    .trigger('click');

  setTimeout(function(){ start(); }, 20);
});

asyncTest('ctrl-clicking on a link with falsy "data-remote" attribute does not fire ajaxyness even if "data-params" present', 0, function() {
  var link = $('a[data-remote]'), e;
  e = $.Event('click');
  e.metaKey = true;

  link
    .removeAttr('data-params')
    .attr('data-remote', 'false')
    .attr('data-method', 'POST')
    .bind('ajax:beforeSend', function() {
      ok(false, 'ajax should not be triggered');
    })
    .bind('click', function() {
      return false;
    })
    .trigger(e);

  e = $.Event('click');
  e.metaKey = true;

  link
    .removeAttr('data-method')
    .attr('data-params', 'name=steve')
    .trigger(e);

  setTimeout(function(){ start(); }, 20);
});

asyncTest('clicking on a button with falsy "data-remote" attribute', 0, function() {
  $('button[data-remote]:first')
    .attr('data-remote', 'false')
    .bind('ajax:beforeSend', function() {
      ok(false, 'ajax should not be triggered');
    })
    .bind('click', function() {
      return false;
    })
    .trigger('click');

  setTimeout(function(){ start(); }, 20);
});

asyncTest('submitting a form with falsy "data-remote" attribute', 0, function() {
  $('form[data-remote]:first')
    .attr('data-remote', 'false')
    .bind('ajax:beforeSend', function() {
      ok(false, 'ajax should not be triggered');
    })
    .bind('submit', function() {
      return false;
    })
    .trigger('submit');

  setTimeout(function(){ start(); }, 20);
});

asyncTest('changing a select option with falsy "data-remote" attribute', 0, function() {
  $('form')
    .append(
      $('<select />', {
        'name': 'user_data',
        'data-remote': 'false',
        'data-params': 'data1=value1',
        'data-url': '/echo'
      })
      .append($('<option />', {value: 'optionValue1', text: 'option1'}))
      .append($('<option />', {value: 'optionValue2', text: 'option2'}))
    );

  $('select[data-remote=false]:first')
    .bind('ajax:beforeSend', function() {
      ok(false, 'ajax should not be triggered');
    })
    .val('optionValue2')
    .trigger('change');

  setTimeout(function(){ start(); }, 20);
});
