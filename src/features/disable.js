import config from '../config'
import { stopEverything } from '../utils/event'
import { formElements, enableFormElement, disableFormElement } from '../utils/form'

//  Replace element's html with the 'data-disable-with' after storing original html
//  and prevent clicking on it
export function disableElement(element) {
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

// Restore element to its original state which was disabled by 'disableElement' above
export function enableElement(element) {
  if (element.data('ujs:enable-with') !== undefined) {
    element.html(element.data('ujs:enable-with')) // set to old enabled state
    element.removeData('ujs:enable-with') // clean up cache
  }
  element.unbind('click.railsDisable') // enable element
  element.removeData('ujs:disabled')
}

export function disableFormElements(form) {
  formElements(form, config.disableSelector).each(function() {
    disableFormElement($(this))
  })
}

export function enableFormElements(form) {
  formElements(form, config.enableSelector).each(function() {
    enableFormElement($(this))
  })
}
