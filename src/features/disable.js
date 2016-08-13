//= require_tree ../utils

const { matches, getData, setData, stopEverything, formElements } = Rails

// Unified function to enable an element (link, button and form)
Rails.enableElement = function(e) {
  let element = e.target ? e.target : e

  if (matches(element, Rails.linkDisableSelector)) {
    enableLinkElement(element)
  } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
    enableFormElement(element)
  } else if (matches(element, Rails.formSubmitSelector)) {
    enableFormElements(element)
  }
}

// Unified function to disable an element (link, button and form)
Rails.disableElement = function(e) {
  let element = e.target ? e.target : e

  if (matches(element, Rails.linkDisableSelector)) {
    disableLinkElement(element)
  } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
    disableFormElement(element)
  } else if (matches(element, Rails.formSubmitSelector)) {
    disableFormElements(element)
  }
}

//  Replace element's html with the 'data-disable-with' after storing original html
//  and prevent clicking on it
function disableLinkElement(element) {
  let replacement = element.getAttribute('data-disable-with')

  if (replacement != null) {
    setData(element, 'ujs:enable-with', element.innerHTML) // store enabled state
    element.innerHTML = replacement
  }

  element.addEventListener('click', stopEverything) // prevent further clicking
  setData(element, 'ujs:disabled', true)
}

// Restore element to its original state which was disabled by 'disableLinkElement' above
function enableLinkElement(element) {
  if (getData(element, 'ujs:enable-with') != null) {
    element.innerHTML = getData(element, 'ujs:enable-with') // set to old enabled state
    setData(element, 'ujs:enable-with', null) // clean up cache
  }
  element.removeEventListener('click', stopEverything) // enable element
  setData(element, 'ujs:disabled', null)
}

/* Disables form elements:
  - Caches element value in 'ujs:enable-with' data store
  - Replaces element text with value of 'data-disable-with' attribute
  - Sets disabled property to true
*/
function disableFormElements(form) {
  formElements(form, Rails.formDisableSelector).forEach(el => {
    disableFormElement(el)
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
  formElements(form, Rails.formEnableSelector).forEach(el => {
    enableFormElement(el)
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
