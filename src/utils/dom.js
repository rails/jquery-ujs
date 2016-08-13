let m = Element.prototype.matches ||
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector

const expando = '_ujsData'

Rails.matches = function(element, selector) {
  if (selector.exclude) {
    return m.call(element, selector.selector) && !m.call(element, selector.exclude)
  } else {
    return m.call(element, selector)
  }
}

Rails.getData = function(element, key) {
  return element[expando] && element[expando][key]
}

Rails.setData = function(element, key, value) {
  if (!element[expando]) {
    element[expando] = {}
  }
  element[expando][key] = value
}

// a wrapper for document.querySelectorAll
// returns an Array
Rails.$ = function(selector) {
  return Array.prototype.slice.call(document.querySelectorAll(selector))
}
