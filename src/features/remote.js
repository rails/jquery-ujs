import config from '../config'
import { fire, stopEverything } from '../utils/event'
import { ajax, href, isCrossDomain } from '../utils/ajax'
import { blankInputs } from '../utils/form'
import { matches, getData, setData } from '../utils/dom'

// Checks "data-remote" if true to handle the request through a XHR request.
function isRemote(element) {
  let value = element.getAttribute('data-remote')
  return value !== null && value !== 'false'
}

// Submits "remote" forms and links with ajax
export function handleRemote(e) {
  let element = e.target, method, url, data, withCredentials, dataType, options

  if (!isRemote(element)) return true

  if (!fire(element, 'ajax:before')) {
    fire(element, 'ajax:stopped')
    return false
  }

  withCredentials = element.getAttribute('data-with-credentials')
  dataType = element.getAttribute('data-type') || 'script'

  if (matches(element, config.formSubmitSelector)) {
    // memoized value from clicked submit button
    let button = getData(element, 'ujs:submit-button')

    method = getData(element, 'ujs:submit-button-formmethod') || element.method
    url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action')

    if (element.enctype === 'multipart/form-data') {
      data = new FormData(element)
      if (button) {
        data.append(button.name, button.value)
      }
    } else {
      data = $(element).serializeArray()
      if (button) {
        data.push(button)
      }
      data = $.param(data)
    }
    setData(element, 'ujs:submit-button', null)
    setData(element, 'ujs:submit-button-formmethod', null)
    setData(element, 'ujs:submit-button-formaction', null)
  } else if (matches(element, config.inputChangeSelector)) {
    method = element.getAttribute('data-method')
    url = element.getAttribute('data-url')
    data = $(element).serialize()
    if (element.getAttribute('data-params')) data = data + '&' + element.getAttribute('data-params')
  } else if (matches(element, config.buttonClickSelector)) {
    method = element.getAttribute('data-method')
    url = element.getAttribute('data-url')
    data = $(element).serialize()
    if (element.getAttribute('data-params')) data = data + '&' + element.getAttribute('data-params')
  } else {
    method = element.getAttribute('data-method')
    url = href(element)
    data = element.getAttribute('data-params') || null
  }

  options = {
    type: method || 'GET',
    url: url,
    data: data,
    dataType: dataType,
    // stopping the "ajax:beforeSend" event will cancel the ajax request
    beforeSend: function(xhr, settings) {
      if (fire(element, 'ajax:beforeSend', [xhr, settings])) {
        fire(element, 'ajax:send', xhr)
      } else {
        fire(element, 'ajax:stopped')
        return false
      }
    },
    success: function(...args) {
      fire(element, 'ajax:success', args)
    },
    complete: function(...args) {
      fire(element, 'ajax:complete', args)
    },
    error: function(...args) {
      fire(element, 'ajax:error', args)
    },
    crossDomain: isCrossDomain(url),
    withCredentials: withCredentials && withCredentials !== 'false'
  }

  ajax(options)
  return stopEverything(e)
}

// Check whether any required fields are empty
// In both ajax mode and normal mode
export function validateForm(e) {
  var form = e.target, blankRequiredInputs

  // Skip other logic when required values are missing or file upload is present
  if (!form.noValidate) {
    if (getData(form, 'ujs:formnovalidate-button') === undefined) {
      blankRequiredInputs = blankInputs(form, config.requiredInputSelector, false)
      if (blankRequiredInputs && fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return stopEverything(e)
      }
    } else {
      // Clear the formnovalidate in case the next button click is not on a formnovalidate button
      // Not strictly necessary to do here, since it is also reset on each button click, but just to be certain
      setData(form, 'ujs:formnovalidate-button', undefined)
    }
  }
}

export function formSubmitButtonClick(e) {
  var button = e.target

  // Register the pressed submit button
  var form = button.form,
      name = button.name,
      data = name ? { name: name, value: button.value } : null

  if (form) {
    setData(form, 'ujs:submit-button', data)
    // Save attributes from button
    setData(form, 'ujs:formnovalidate-button', button.formNoValidate)
    setData(form, 'ujs:submit-button-formaction', button.formAction)
    setData(form, 'ujs:submit-button-formmethod', button.formMethod)
  }
}
