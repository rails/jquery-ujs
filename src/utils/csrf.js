// Up-to-date Cross-Site Request Forgery token
export function csrfToken() {
  return $('meta[name=csrf-token]').attr('content')
}

// URL param that must contain the CSRF token
export function csrfParam() {
  return $('meta[name=csrf-param]').attr('content')
}

// Make sure that every Ajax request sends the CSRF token
export function CSRFProtection(xhr) {
  var token = csrfToken()
  if (token) xhr.setRequestHeader('X-CSRF-Token', token)
}

// Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
export function refreshCSRFTokens() {
  $('form input[name="' + csrfParam() + '"]').val(csrfToken())
}
