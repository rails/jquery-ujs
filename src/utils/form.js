// Helper function that returns form elements that match the specified CSS selector
// If form is actually a "form" element this will return associated elements outside the from that have
// the html form attribute set
export function formElements(form, selector) {
  return $(form).is('form') ? $(form.elements).filter(selector) : $(form).find(selector)
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
