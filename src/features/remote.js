import config from '../config'
import { fire } from '../utils/event'
import { ajax, href, isCrossDomain } from '../utils/ajax'

// Checks "data-remote" if true to handle the request through a XHR request.
export function isRemote(element) {
  return element.data('remote') !== undefined && element.data('remote') !== false
}

// Submits "remote" forms and links with ajax
export function handleRemote(element) {
  var method, url, data, withCredentials, dataType, options

  if (!fire(element, 'ajax:before')) {
    fire(element, 'ajax:stopped')
    return false
  }

  withCredentials = element.data('with-credentials') || null
  dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType)

  if (element.is(config.formSubmitSelector)) {
    method = element.data('ujs:submit-button-formmethod') || element.attr('method')
    url = element.data('ujs:submit-button-formaction') || element.attr('action')
    data = $(element[0]).serializeArray()
    // memoized value from clicked submit button
    var button = element.data('ujs:submit-button')
    if (button) {
      data.push(button)
      element.data('ujs:submit-button', null)
    }
    element.data('ujs:submit-button-formmethod', null)
    element.data('ujs:submit-button-formaction', null)
  } else if (element.is(config.inputChangeSelector)) {
    method = element.data('method')
    url = element.data('url')
    data = element.serialize()
    if (element.data('params')) data = data + '&' + element.data('params')
  } else if (element.is(config.buttonClickSelector)) {
    method = element.data('method') || 'get'
    url = element.data('url')
    data = element.serialize()
    if (element.data('params')) data = data + '&' + element.data('params')
  } else {
    method = element.data('method')
    url = href(element)
    data = element.data('params') || null
  }

  options = {
    type: method || 'GET', data: data, dataType: dataType,
    // stopping the "ajax:beforeSend" event will cancel the ajax request
    beforeSend: function(xhr, settings) {
      if (settings.dataType === undefined) {
        xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script)
      }
      if (fire(element, 'ajax:beforeSend', [xhr, settings])) {
        element.trigger('ajax:send', xhr)
      } else {
        fire(element, 'ajax:stopped')
        return false
      }
    },
    success: function(...args) {
      element.trigger('ajax:success', args)
    },
    complete: function(...args) {
      element.trigger('ajax:complete', args)
    },
    error: function(...args) {
      element.trigger('ajax:error', args)
    },
    crossDomain: isCrossDomain(url)
  }

  // There is no withCredentials for IE6-8 when
  // "Enable native XMLHTTP support" is disabled
  if (withCredentials) {
    options.xhrFields = {
      withCredentials: withCredentials
    }
  }

  // Only pass url to `ajax` options if not blank
  if (url) {
    options.url = url
  }

  return ajax(options)
}
