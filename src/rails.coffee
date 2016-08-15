#
# Unobtrusive JavaScript
# https://github.com/rails/jquery-ujs
#
# Released under the MIT license
#
#= require ./config
#= require_tree ./utils
#= require_tree ./features

{
  fire, delegate
  getData, $
  refreshCSRFTokens, CSRFProtection
  enableElement, disableElement
  handleConfirm
  handleRemote, validateForm, formSubmitButtonClick, handleMetaClick
  handleMethod
} = Rails

# For backward compatibility
if jQuery? and not jQuery.rails
  jQuery.rails = Rails
  jQuery.ajaxPrefilter (options, originalOptions, xhr) ->
    CSRFProtection(xhr) unless options.crossDomain

Rails.start = ->
  # Cut down on the number of issues from people inadvertently including jquery_ujs twice
  # by detecting and raising an error when it happens.
  throw new Error('jquery-ujs has already been loaded!') if window._rails_loaded

  # This event works the same as the load event, except that it fires every
  # time the page is loaded.
  # See https://github.com/rails/jquery-ujs/issues/357
  # See https://developer.mozilla.org/en-US/docs/Using_Firefox_1.5_caching
  window.addEventListener 'pageshow', ->
    $(Rails.formEnableSelector).forEach (el) ->
      enableElement(el) if getData(el, 'ujs:disabled')
    $(Rails.linkDisableSelector).forEach (el) ->
      enableElement(el) if getData(el, 'ujs:disabled')

  delegate document, Rails.linkDisableSelector, 'ajax:complete', enableElement
  delegate document, Rails.linkDisableSelector, 'ajax:stopped', enableElement
  delegate document, Rails.buttonDisableSelector, 'ajax:complete', enableElement
  delegate document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement

  delegate document, Rails.linkClickSelector, 'click', handleConfirm
  delegate document, Rails.linkClickSelector, 'click', handleMetaClick
  delegate document, Rails.linkClickSelector, 'click', disableElement
  delegate document, Rails.linkClickSelector, 'click', handleRemote
  delegate document, Rails.linkClickSelector, 'click', handleMethod

  delegate document, Rails.buttonClickSelector, 'click', handleConfirm
  delegate document, Rails.buttonClickSelector, 'click', disableElement
  delegate document, Rails.buttonClickSelector, 'click', handleRemote

  delegate document, Rails.inputChangeSelector, 'change', handleConfirm
  delegate document, Rails.inputChangeSelector, 'change', handleRemote

  delegate document, Rails.formSubmitSelector, 'submit', handleConfirm
  delegate document, Rails.formSubmitSelector, 'submit', validateForm
  delegate document, Rails.formSubmitSelector, 'submit', handleRemote
  # Normal mode submit
  # Slight timeout so that the submit button gets properly serialized
  delegate document, Rails.formSubmitSelector, 'submit', (e) -> setTimeout((-> disableElement(e)), 13)
  delegate document, Rails.formSubmitSelector, 'ajax:send', disableElement
  delegate document, Rails.formSubmitSelector, 'ajax:complete', enableElement

  delegate document, Rails.formInputClickSelector, 'click', handleConfirm
  delegate document, Rails.formInputClickSelector, 'click', formSubmitButtonClick

  document.addEventListener('DOMContentLoaded', refreshCSRFTokens)
  window._rails_loaded = true

if window.Rails is Rails and fire(document, 'rails:attachBindings')
  Rails.start()
