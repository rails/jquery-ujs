import config from '../config'
import { stopEverything } from '../utils/event'
import { formElements } from '../utils/form'

// Unified function to enable an element (link, button and form)
export function enableElement(e) {
  let element = e.target ? $(e.target) : e

  if (element.is(config.linkDisableSelector)) {
    enableLinkElement(element)
  } else if (element.is(config.buttonDisableSelector) || element.is(config.formEnableSelector)) {
    enableFormElement(element)
  } else if (element.is(config.formSubmitSelector)) {
    enableFormElements(element)
  }
}

// Unified function to disable an element (link, button and form)
export function disableElement(e) {
  let element = e.target ? $(e.target) : e

  if (element.is(config.linkDisableSelector)) {
    disableLinkElement(element)
  } else if (element.is(config.buttonDisableSelector) || element.is(config.formDisableSelector)) {
    disableFormElement(element)
  } else if (element.is(config.formSubmitSelector)) {
    disableFormElements(element)
  }
}

//  Replace element's html with the 'data-disable-with' after storing original html
//  and prevent clicking on it
function disableLinkElement(element) {
  var replacement = element.data('disable-with')

  if (replacement !== undefined) {
    element.data('ujs:enable-with', element.html()) // store enabled state
    element.html(replacement)
  }

  element.bind('click.railsDisable', function(e) { // prevent further clicking
    return stopEverything(e)
  })
  element.data('ujs:disabled', true)
}

// Restore element to its original state which was disabled by 'disableLinkElement' above
function enableLinkElement(element) {
  if (element.data('ujs:enable-with') !== undefined) {
    element.html(element.data('ujs:enable-with')) // set to old enabled state
    element.removeData('ujs:enable-with') // clean up cache
  }
  element.unbind('click.railsDisable') // enable element
  element.removeData('ujs:disabled')
}

/* Disables form elements:
  - Caches element value in 'ujs:enable-with' data store
  - Replaces element text with value of 'data-disable-with' attribute
  - Sets disabled property to true
*/
function disableFormElements(form) {
  formElements(form, config.formDisableSelector).each(function() {
    disableFormElement($(this))
  })
}

function disableFormElement(element) {
  var method, replacement

  method = element.is('button') ? 'html' : 'val'
  replacement = element.data('disable-with')

  if (replacement !== undefined) {
    element.data('ujs:enable-with', element[method]())
    element[method](replacement)
  }

  element.prop('disabled', true)
  element.data('ujs:disabled', true)
}

/* Re-enables disabled form elements:
  - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
  - Sets disabled property to false
*/
function enableFormElements(form) {
  formElements(form, config.formEnableSelector).each(function() {
    enableFormElement($(this))
  })
}

function enableFormElement(element) {
  var method = element.is('button') ? 'html' : 'val'
  if (element.data('ujs:enable-with') !== undefined) {
    element[method](element.data('ujs:enable-with'))
    element.removeData('ujs:enable-with') // clean up cache
  }
  element.prop('disabled', false)
  element.removeData('ujs:disabled')
}
