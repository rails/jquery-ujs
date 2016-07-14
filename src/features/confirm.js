import { fire, stopEverything } from '../utils/event'

export function handleConfirm(e) {
  if (!allowAction($(e.target))) {
    return stopEverything(e)
  }
}

// Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
function confirm(message) {
  return window.confirm(message)
}

/* For 'data-confirm' attribute:
   - Fires `confirm` event
   - Shows the confirmation dialog
   - Fires the `confirm:complete` event

   Returns `true` if no function stops the chain and user chose yes `false` otherwise.
   Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
   Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
   return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
*/
function allowAction(element) {
  var message = element.data('confirm'),
      answer = false, callback
  if (!message) { return true }

  if (fire(element, 'confirm')) {
    try {
      answer = confirm(message)
    } catch (e) {
      (console.error || console.log).call(console, e.stack || e)
    }
    callback = fire(element, 'confirm:complete', [answer])
  }
  return answer && callback
}
