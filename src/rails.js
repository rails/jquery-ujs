/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.8.0 or later.
 *
 * Released under the MIT license
 *
 */

import config from './config'
import { fire, delegate } from './utils/event'
import { getData, $ } from './utils/dom'
import { refreshCSRFTokens, CSRFProtection, csrfToken, csrfParam } from './utils/csrf'
import { href, ajax } from './utils/ajax'
import { enableElement, disableElement } from './features/disable'
import { handleConfirm } from './features/confirm'
import { handleRemote, validateForm, formSubmitButtonClick } from './features/remote'
import { handleMethod } from './features/method'

// Cut down on the number of issues from people inadvertently including jquery_ujs twice
// by detecting and raising an error when it happens.
if ( window.rails !== undefined ) {
  throw new Error('jquery-ujs has already been loaded!')
}

// For backward compatibility
window.rails = { disableElement, getData, handleRemote, refreshCSRFTokens, csrfToken, csrfParam, href, ajax, delegate }
if (window.jQuery) {
  window.jQuery.rails = window.rails
  window.jQuery.ajaxPrefilter((options, originalOptions, xhr) => {
    if (!options.crossDomain) CSRFProtection(xhr)
  })
}

if (fire(document, 'rails:attachBindings')) {

  // This event works the same as the load event, except that it fires every
  // time the page is loaded.
  //
  // See https://github.com/rails/jquery-ujs/issues/357
  // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
  window.addEventListener('pageshow', () => {
    $(config.formEnableSelector).forEach(el => {
      if (getData(el, 'ujs:disabled')) {
        enableElement(el)
      }
    })

    $(config.linkDisableSelector).forEach(el => {
      if (getData(el, 'ujs:disabled')) {
        enableElement(el)
      }
    })
  })

  delegate(document, config.linkDisableSelector, 'ajax:complete', enableElement)
  delegate(document, config.linkDisableSelector, 'ajax:stopped', enableElement)
  delegate(document, config.buttonDisableSelector, 'ajax:complete', enableElement)
  delegate(document, config.buttonDisableSelector, 'ajax:stopped', enableElement)

  delegate(document, config.linkClickSelector, 'click', handleConfirm)
  delegate(document, config.linkClickSelector, 'click', e => {
    let link = e.target,
        method = link.getAttribute('data-method'),
        data = link.getAttribute('data-params'),
        metaClick = e.metaKey || e.ctrlKey

    if (metaClick && (!method || method === 'GET') && !data) {
      e.stopImmediatePropagation()
    }
  })
  delegate(document, config.linkClickSelector, 'click', disableElement)
  delegate(document, config.linkClickSelector, 'click', handleRemote)
  delegate(document, config.linkClickSelector, 'click', handleMethod)

  delegate(document, config.buttonClickSelector, 'click', handleConfirm)
  delegate(document, config.buttonClickSelector, 'click', disableElement)
  delegate(document, config.buttonClickSelector, 'click', handleRemote)

  delegate(document, config.inputChangeSelector, 'change', handleConfirm)
  delegate(document, config.inputChangeSelector, 'change', handleRemote)

  delegate(document, config.formSubmitSelector, 'submit', handleConfirm)
  delegate(document, config.formSubmitSelector, 'submit', validateForm)
  delegate(document, config.formSubmitSelector, 'submit', handleRemote)
  // Normal mode submit
  // Slight timeout so that the submit button gets properly serialized
  delegate(document, config.formSubmitSelector, 'submit', e => setTimeout(() => disableElement(e), 13))
  delegate(document, config.formSubmitSelector, 'ajax:send', disableElement)
  delegate(document, config.formSubmitSelector, 'ajax:complete', enableElement)

  delegate(document, config.formInputClickSelector, 'click', handleConfirm)
  delegate(document, config.formInputClickSelector, 'click', formSubmitButtonClick)

  document.addEventListener('DOMContentLoaded', () => refreshCSRFTokens())
}
