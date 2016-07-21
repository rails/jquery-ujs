// Default ajax function, may be overridden with custom function in $.rails.ajax
export function ajax(options) {
  return $.ajax(options)
}

// Default way to get an element's href. May be overridden at $.rails.href.
export function href(element) {
  return element.href
}

// Determines if the request is a cross domain request.
export function isCrossDomain(url) {
  var originAnchor = document.createElement('a')
  originAnchor.href = location.href
  var urlAnchor = document.createElement('a')

  try {
    urlAnchor.href = url
    // This is a workaround to a IE bug.
    urlAnchor.href = urlAnchor.href

    // If URL protocol is false or is a string containing a single colon
    // *and* host are false, assume it is not a cross-domain request
    // (should only be the case for IE7 and IE compatibility mode).
    // Otherwise, evaluate protocol and host of the URL against the origin
    // protocol and host.
    return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) ||
      (originAnchor.protocol + '//' + originAnchor.host ===
        urlAnchor.protocol + '//' + urlAnchor.host))
  } catch (e) {
    // If there is an error parsing the URL, assume it is crossDomain.
    return true
  }
}
