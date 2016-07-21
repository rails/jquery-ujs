import { matches } from './dom'

// Helper function that returns form elements that match the specified CSS selector
// If form is actually a "form" element this will return associated elements outside the from that have
// the html form attribute set
export function formElements(form, selector) {
  if (matches(form, 'form')) {
    return Array.prototype.filter.call(form.elements, el => matches(el, selector))
  } else {
    return Array.prototype.slice.call(form.querySelectorAll(selector))
  }
}

// Helper function which checks for blank inputs in a form that match the specified CSS selector
export function blankInputs(form, selector, nonBlank) {
  var foundInputs = [],
      requiredInputs = form.querySelectorAll(selector || 'input, textarea'),
      checkedRadioButtonNames = {}

  Array.prototype.forEach.call(requiredInputs, input => {
    if (input.type === 'radio') {

      // Don't count unchecked required radio as blank if other radio with same name is checked,
      // regardless of whether same-name radio input has required attribute or not. The spec
      // states https://www.w3.org/TR/html5/forms.html#the-required-attribute
      let radioName = input.name

      // Skip if we've already seen the radio with this name.
      if (!checkedRadioButtonNames[radioName]) {

        // If none checked
        if (form.querySelectorAll('input[type=radio][name="' + radioName + '"]:checked').length === 0) {
          let radios = form.querySelectorAll('input[type=radio][name="' + radioName + '"]')
          foundInputs = foundInputs.concat(Array.prototype.slice.call(radios))
        }

        // We only need to check each name once.
        checkedRadioButtonNames[radioName] = radioName
      }
    } else {
      let valueToCheck = input.type === 'checkbox' ? input.checked : !!input.value
      if (valueToCheck === nonBlank) {
        foundInputs.push(input)
      }
    }
  })
  return foundInputs.length ? foundInputs : false
}
