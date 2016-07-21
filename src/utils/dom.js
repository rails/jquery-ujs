let m = Element.prototype.matches ||
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector

const expando = '_ujsData'

export function matches(element, selector) {
  return m.call(element, selector)
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
