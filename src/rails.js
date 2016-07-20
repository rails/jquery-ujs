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
import { fire } from './utils/event'
import { refreshCSRFTokens, CSRFProtection, csrfToken, csrfParam } from './utils/csrf'
import { href, ajax } from './utils/ajax'
import { enableElement, disableElement } from './features/disable'
import { handleConfirm } from './features/confirm'
import { handleRemote, validateForm, formSubmitButtonClick } from './features/remote'
import { handleMethod } from './features/method'

// Cut down on the number of issues from people inadvertently including jquery_ujs twice
// by detecting and raising an error when it happens.
if ( $.rails !== undefined ) {
  $.error('jquery-ujs has already been loaded!')
}

// For backward compatibility
$.rails = Object.assign({ disableElement, handleRemote, refreshCSRFTokens, csrfToken, csrfParam, href, ajax }, config)

// Shorthand to make it a little easier to call public rails functions from within js
var $document = $(document)

if (fire($document, 'rails:attachBindings')) {

  $.ajaxPrefilter(function(options, originalOptions, xhr) { if ( !options.crossDomain ) { CSRFProtection(xhr) }})

  $document.delegate(config.linkClickSelector, 'click.rails', handleConfirm)
  $document.delegate(config.buttonClickSelector, 'click.rails', handleConfirm)
  $document.delegate(config.inputChangeSelector, 'change.rails', handleConfirm)
  $document.delegate(config.formSubmitSelector, 'submit.rails', handleConfirm)
  $document.delegate(config.formInputClickSelector, 'click.rails', handleConfirm)

  // This event works the same as the load event, except that it fires every
  // time the page is loaded.
  //
  // See https://github.com/rails/jquery-ujs/issues/357
  // See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
  $(window).on('pageshow.rails', function() {
    $(config.formEnableSelector).each(function() {
      var element = $(this)

      if (element.data('ujs:disabled')) {
        enableElement(element)
      }
    })

    $(config.linkDisableSelector).each(function() {
      var element = $(this)

      if (element.data('ujs:disabled')) {
        enableElement(element)
      }
    })
  })

  $document.delegate(config.linkDisableSelector, 'ajax:complete', function() {
    enableElement($(this))
  })

  $document.delegate(config.linkDisableSelector, 'ajax:stopped', function() {
    enableElement($(this))
  })

  $document.delegate(config.buttonDisableSelector, 'ajax:complete', function() {
    enableElement($(this))
  })

  $document.delegate(config.buttonDisableSelector, 'ajax:stopped', function() {
    enableElement($(this))
  })

  $document.delegate(config.linkClickSelector, 'click.rails', function(e) {
    var link = $(this),
        method = link.data('method'),
        data = link.data('params'),
        metaClick = e.metaKey || e.ctrlKey

    if (metaClick && (!method || method === 'GET') && !data) { return true }

    disableElement(link)
    return handleRemote(e)
  })

  $document.delegate(config.linkClickSelector, 'click.rails', handleMethod)

  $document.delegate(config.buttonClickSelector, 'click.rails', function(e) {
    var button = $(e.target)

    disableElement(button)
    return handleRemote(e)
  })

  $document.delegate(config.inputChangeSelector, 'change.rails', function(e) {
    return handleRemote(e)
  })

  $document.delegate(config.formSubmitSelector, 'submit.rails', function(e) {
    var form = $(this)

    if (validateForm(e) === false) {
      return false
    }
    if (handleRemote(e) === false) {
      return false
    }
    // Normal mode submit
    // Slight timeout so that the submit button gets properly serialized
    setTimeout(function() { disableElement(form) }, 13)
  })

  $document.delegate(config.formInputClickSelector, 'click.rails', formSubmitButtonClick)

  $document.delegate(config.formSubmitSelector, 'ajax:send.rails', function(event) {
    if (this === event.target) disableElement($(this))
  })

  $document.delegate(config.formSubmitSelector, 'ajax:complete.rails', function(event) {
    if (this === event.target) enableElement($(this))
  })

  $(function() {
    refreshCSRFTokens()
  })
}
