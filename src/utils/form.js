// Helper function that returns form elements that match the specified CSS selector
// If form is actually a "form" element this will return associated elements outside the from that have
// the html form attribute set
export function formElements(form, selector) {
  return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector)
}

/* Disables form elements:
  - Caches element value in 'ujs:enable-with' data store
  - Replaces element text with value of 'data-disable-with' attribute
  - Sets disabled property to true
*/
export function disableFormElement(element) {
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
export function enableFormElement(element) {
  var method = element.is('button') ? 'html' : 'val'
  if (element.data('ujs:enable-with') !== undefined) {
    element[method](element.data('ujs:enable-with'))
    element.removeData('ujs:enable-with') // clean up cache
  }
  element.prop('disabled', false)
  element.removeData('ujs:disabled')
}

// Helper function which checks for blank inputs in a form that match the specified CSS selector
export function blankInputs(form, specifiedSelector, nonBlank) {
  var foundInputs = $(),
      input,
      valueToCheck,
      radiosForNameWithNoneSelected,
      radioName,
      selector = specifiedSelector || 'input,textarea',
      requiredInputs = form.find(selector),
      checkedRadioButtonNames = {}

  requiredInputs.each(function() {
    input = $(this)
    if (input.is('input[type=radio]')) {

      // Don't count unchecked required radio as blank if other radio with same name is checked,
      // regardless of whether same-name radio input has required attribute or not. The spec
      // states https://www.w3.org/TR/html5/forms.html#the-required-attribute
      radioName = input.attr('name')

      // Skip if we've already seen the radio with this name.
      if (!checkedRadioButtonNames[radioName]) {

        // If none checked
        if (form.find('input[type=radio]:checked[name="' + radioName + '"]').length === 0) {
          radiosForNameWithNoneSelected = form.find(
            'input[type=radio][name="' + radioName + '"]')
          foundInputs = foundInputs.add(radiosForNameWithNoneSelected)
        }

        // We only need to check each name once.
        checkedRadioButtonNames[radioName] = radioName
      }
    } else {
      valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : !!input.val()
      if (valueToCheck === nonBlank) {
        foundInputs = foundInputs.add(input)
      }
    }
  })
  return foundInputs.length ? foundInputs : false
}

// Helper function which checks for non-blank inputs in a form that match the specified CSS selector
export function nonBlankInputs(form, specifiedSelector) {
  return blankInputs(form, specifiedSelector, true) // true specifies nonBlank
}
