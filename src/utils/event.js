import { matches } from './dom'

// Polyfill for CustomEvent in IE9+
// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
let CustomEvent = window.CustomEvent
if (typeof CustomEvent === 'function') {
  CustomEvent = function(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }
  CustomEvent.prototype = window.Event.prototype
}

// Triggers an event on an element and returns false if the event result is false
export function fire(obj, name, data) {
  let event = new CustomEvent(name, {
    bubbles: true,
    cancelable: true,
    detail: data,
  })
  obj.dispatchEvent(event)
  return !event.defaultPrevented
}

// Helper function, needed to provide consistent behavior in IE
export function stopEverything(e) {
  fire(e.target, 'ujs:everythingStopped')
  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation()
}

export function delegate(element, selector, eventType, handler) {
  element.addEventListener(eventType, e => {
    if (matches(e.target, selector)) {
      if (handler.call(e.target, e) === false) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  })
}
