//= require ./dom

const { $ } = Rails

// Up-to-date Cross-Site Request Forgery token
let csrfToken = Rails.csrfToken = function() {
  let meta = document.querySelector('meta[name=csrf-token]')
  return meta && meta.content
}

// URL param that must contain the CSRF token
let csrfParam = Rails.csrfParam = function() {
  let meta = document.querySelector('meta[name=csrf-param]')
  return meta && meta.content
}

// Make sure that every Ajax request sends the CSRF token
Rails.CSRFProtection = function(xhr) {
  let token = csrfToken()
  if (token) xhr.setRequestHeader('X-CSRF-Token', token)
}

// Make sure that all forms have actual up-to-date tokens (cached forms contain old ones)
Rails.refreshCSRFTokens = function() {
  let token = csrfToken(),
      param = csrfParam()

  if (token && param) {
    $('form input[name="' + param + '"]').forEach(input => {
      input.value = token
    })
  }
}
