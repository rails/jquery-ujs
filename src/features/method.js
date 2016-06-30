import * as csrf from '../utils/csrf'
import * as ajax from '../utils/ajax'

export function setup(selector, event) {
  $(document).delegate(selector, event, e => {
    var link = $(e.target)
    if (link.data('method')) handleMethod(link)
    return false
  })
}

// Handles "data-method" on links such as:
// <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
function handleMethod(link) {
  var href = ajax.href(link),
      method = link.data('method'),
      target = link.attr('target'),
      csrfToken = csrf.csrfToken(),
      csrfParam = csrf.csrfParam(),
      form = $('<form method="post" action="' + href + '"></form>'),
      metadataInput = '<input name="_method" value="' + method + '" type="hidden" />'

  if (csrfParam !== undefined && csrfToken !== undefined && !ajax.isCrossDomain(href)) {
    metadataInput += '<input name="' + csrfParam + '" value="' + csrfToken + '" type="hidden" />'
  }

  if (target) { form.attr('target', target) }

  form.hide().append(metadataInput).appendTo('body')
  form.submit()
}
