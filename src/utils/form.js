import { matches } from './dom'

const toArray = e => Array.prototype.slice.call(e)

export function serializeElement(element, additionalParam) {
  let inputs = [element]
  let params = []

  if (matches(element, 'form')) {
    inputs = toArray(element.elements)
  }

  inputs.forEach(input => {
    if (!input.name) return

    if (matches(input, 'select')) {
      toArray(input.options).forEach(option => {
        if (option.selected) {
          params.push({ name: input.name, value: option.value })
        }
      })
    } else if ((input.type !== 'radio' && input.type !== 'checkbox') || input.checked) {
      params.push({ name: input.name, value: input.value })
    }
  })

  if (additionalParam) {
    params.push(additionalParam)
  }

  return params.map(param => {
    if (param.name) {
      return `${encodeURIComponent(param.name)}=${encodeURIComponent(param.value)}`
    } else {
      return param
    }
  }).join('&')
}

// Helper function that returns form elements that match the specified CSS selector
// If form is actually a "form" element this will return associated elements outside the from that have
// the html form attribute set
export function formElements(form, selector) {
  if (matches(form, 'form')) {
    return toArray(form.elements).filter(el => matches(el, selector))
  } else {
    return toArray(form.querySelectorAll(selector))
  }
}

// Helper function which checks for blank inputs in a form that match the specified CSS selector
export function blankInputs(form, selector, nonBlank) {
  let foundInputs = [],
      requiredInputs = toArray(form.querySelectorAll(selector || 'input, textarea')),
      checkedRadioButtonNames = {}

  requiredInputs.forEach(input => {
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
          foundInputs = foundInputs.concat(toArray(radios))
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
