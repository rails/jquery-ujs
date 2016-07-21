import config from '../config'
import { stopEverything } from '../utils/event'
import { formElements } from '../utils/form'
import { matches, getData, setData } from '../utils/dom'

// Unified function to enable an element (link, button and form)
export function enableElement(e) {
  let element = e.target ? e.target : e

  if (matches(element, config.linkDisableSelector)) {
    enableLinkElement(element)
  } else if (matches(element, config.buttonDisableSelector) || matches(element, config.formEnableSelector)) {
    enableFormElement(element)
  } else if (matches(element, config.formSubmitSelector)) {
    enableFormElements(element)
  }
}

// Unified function to disable an element (link, button and form)
export function disableElement(e) {
  let element = e.target ? e.target : e

  if (matches(element, config.linkDisableSelector)) {
    disableLinkElement(element)
  } else if (matches(element, config.buttonDisableSelector) || matches(element, config.formDisableSelector)) {
    disableFormElement(element)
  } else if (matches(element, config.formSubmitSelector)) {
    disableFormElements(element)
  }
}

//  Replace element's html with the 'data-disable-with' after storing original html
//  and prevent clicking on it
function disableLinkElement(element) {
  var replacement = element.getAttribute('data-disable-with')

  if (replacement != null) {
    setData(element, 'ujs:enable-with', element.innerHTML) // store enabled state
    element.innerHTML = replacement
  }

  $(element).bind('click.railsDisable', function(e) { // prevent further clicking
    return stopEverything(e)
  })
  setData(element, 'ujs:disabled', true)
}

// Restore element to its original state which was disabled by 'disableLinkElement' above
function enableLinkElement(element) {
  if (getData(element, 'ujs:enable-with') != null) {
    element.innerHTML = getData(element, 'ujs:enable-with') // set to old enabled state
    setData(element, 'ujs:enable-with', null) // clean up cache
  }
  $(element).unbind('click.railsDisable') // enable element
  setData(element, 'ujs:disabled', null)
}

/* Disables form elements:
  - Caches element value in 'ujs:enable-with' data store
  - Replaces element text with value of 'data-disable-with' attribute
  - Sets disabled property to true
*/
function disableFormElements(form) {
  formElements(form, config.formDisableSelector).each(function() {
    disableFormElement(this)
  })
}

function disableFormElement(element) {
  let replacement = element.getAttribute('data-disable-with')

  if (replacement != null) {
    if (matches(element, 'button')) {
      setData(element, 'ujs:enable-with', element.innerHTML)
      element.innerHTML = replacement
    } else {
      setData(element, 'ujs:enable-with', element.value)
      element.value = replacement
    }
  }

  element.disabled = true
  setData(element, 'ujs:disabled', true)
}

/* Re-enables disabled form elements:
  - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
  - Sets disabled property to false
*/
function enableFormElements(form) {
  formElements(form, config.formEnableSelector).each(function() {
    enableFormElement(this)
  })
}

function enableFormElement(element) {
  let originalText = getData(element, 'ujs:enable-with')

  if (originalText != null) {
    if (matches(element, 'button')) {
      element.innerHTML = originalText
    } else {
      element.value = originalText
    }
    setData(element, 'ujs:enable-with', null) // clean up cache
  }
  element.disabled = false
  setData(element, 'ujs:disabled', null)
}
