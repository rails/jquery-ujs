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
import { fire, stopEverything } from './utils/event'
import { refreshCSRFTokens, CSRFProtection, csrfToken, csrfParam } from './utils/csrf'
import { blankInputs, nonBlankInputs } from './utils/form'
import { href, ajax } from './utils/ajax'
import { enableElement, disableElement } from './features/disable'
import { handleConfirm } from './features/confirm'
import { isRemote, handleRemote } from './features/remote'
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
    var link = $(this), method = link.data('method'), data = link.data('params'), metaClick = e.metaKey || e.ctrlKey

    if (!metaClick) disableElement(link)

    if (isRemote(link)) {
      if (metaClick && (!method || method === 'GET') && !data) { return true }

      handleRemote(link)
      return stopEverything(e)
    }
  })

  $document.delegate(config.linkClickSelector, 'click.rails', handleMethod)

  $document.delegate(config.buttonClickSelector, 'click.rails', function(e) {
    var button = $(this)

    if (!isRemote(button)) return stopEverything(e)

    disableElement(button)
    handleRemote(button)
    return false
  })

  $document.delegate(config.inputChangeSelector, 'change.rails', function(e) {
    var link = $(this)
    if (!isRemote(link)) return stopEverything(e)

    handleRemote(link)
    return false
  })

  $document.delegate(config.formSubmitSelector, 'submit.rails', function(e) {
    var form = $(this),
        remote = isRemote(form),
        blankRequiredInputs,
        nonBlankFileInputs

    // Skip other logic when required values are missing or file upload is present
    if (form.attr('novalidate') === undefined) {
      if (form.data('ujs:formnovalidate-button') === undefined) {
        blankRequiredInputs = blankInputs(form, config.requiredInputSelector, false)
        if (blankRequiredInputs && fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
          return stopEverything(e)
        }
      } else {
        // Clear the formnovalidate in case the next button click is not on a formnovalidate button
        // Not strictly necessary to do here, since it is also reset on each button click, but just to be certain
        form.data('ujs:formnovalidate-button', undefined)
      }
    }

    if (remote) {
      nonBlankFileInputs = nonBlankInputs(form, config.fileInputSelector)
      if (nonBlankFileInputs) {
        // Slight timeout so that the submit button gets properly serialized
        // (make it easy for event handler to serialize form without disabled values)
        setTimeout(function() { disableElement(form) }, 13)
        var aborted = fire(form, 'ajax:aborted:file', [nonBlankFileInputs])

        // Re-enable form elements if event bindings return false (canceling normal form submission)
        if (!aborted) { setTimeout(function() { enableElement(form) }, 13) }

        return aborted
      }

      handleRemote(form)
      return false

    } else {
      // Slight timeout so that the submit button gets properly serialized
      setTimeout(function() { disableElement(form) }, 13)
    }
  })

  $document.delegate(config.formInputClickSelector, 'click.rails', function() {
    var button = $(this)

    // Register the pressed submit button
    var name = button.attr('name'),
        data = name ? {name: name, value: button.val()} : null

    var form = button.closest('form')
    if (form.length === 0) {
      form = $('#' + button.attr('form'))
    }
    form.data('ujs:submit-button', data)

    // Save attributes from button
    form.data('ujs:formnovalidate-button', button.attr('formnovalidate'))
    form.data('ujs:submit-button-formaction', button.attr('formaction'))
    form.data('ujs:submit-button-formmethod', button.attr('formmethod'))
  })

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
