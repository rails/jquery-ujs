// Triggers an event on an element and returns false if the event result is false
export function fire(obj, name, data) {
  var event = $.Event(name)
  $(obj).trigger(event, data)
  return event.result !== false
}

// Helper function, needed to provide consistent behavior in IE
export function stopEverything(e) {
  $(e.target).trigger('ujs:everythingStopped')
  e.stopImmediatePropagation()
  return false
}
