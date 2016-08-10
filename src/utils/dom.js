let m = Element.prototype.matches ||
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector

const expando = '_ujsData'

export function matches(element, selector) {
  if (selector.exclude) {
    return m.call(element, selector.selector) && !m.call(element, selector.exclude)
  } else {
    return m.call(element, selector)
  }
}

export function getData(element, key) {
  return element[expando] && element[expando][key]
}

export function setData(element, key, value) {
  if (!element[expando]) {
    element[expando] = {}
  }
  element[expando][key] = value
}

// a wrapper for document.querySelectorAll
// returns an Array
export function $(selector) {
  return Array.prototype.slice.call(document.querySelectorAll(selector))
}
