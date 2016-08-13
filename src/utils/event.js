//= require ./dom

const { matches } = Rails

// Polyfill for CustomEvent in IE9+
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
let CustomEvent = window.CustomEvent
if (typeof CustomEvent === 'function') {
  CustomEvent = function(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    let evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }
  CustomEvent.prototype = window.Event.prototype
}

// Triggers an event on an element and returns false if the event result is false
let fire = Rails.fire = function(obj, name, data) {
  let event = new CustomEvent(name, {
    bubbles: true,
    cancelable: true,
    detail: data,
  })
  obj.dispatchEvent(event)
  return !event.defaultPrevented
}

// Helper function, needed to provide consistent behavior in IE
Rails.stopEverything = function(e) {
  fire(e.target, 'ujs:everythingStopped')
  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation()
}

Rails.delegate = function(element, selector, eventType, handler) {
  element.addEventListener(eventType, e => {
    if (matches(e.target, selector)) {
      if (handler.call(e.target, e) === false) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  })
}
