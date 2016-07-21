// Up-to-date Cross-Site Request Forgery token
export function csrfToken() {
  let meta = document.querySelector('meta[name=csrf-token]')
  return meta && meta.content
}

// URL param that must contain the CSRF token
export function csrfParam() {
  let meta = document.querySelector('meta[name=csrf-param]')
  return meta && meta.content
}

// Make sure that every Ajax request sends the CSRF token
export function CSRFProtection(xhr) {
  let token = csrfToken()
  if (token) xhr.setRequestHeader('X-CSRF-Token', token)
}

// Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
export function refreshCSRFTokens() {
  let token = csrfToken(),
      inputs = document.querySelectorAll('form input[name="' + csrfParam() + '"]')
  Array.prototype.forEach.call(inputs, input => {
    input.value = token
  })
}
