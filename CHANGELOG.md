## v1.1.0

* Extract `$.rails.csrfToken` and `$.rails.csrfParam` functions to allow external usage.

* Treat exception in `$.rails.confirm` as a false answer.

* Don't fire Ajax requests if `data-remote` is `false`.

* Fix IE7 bug with the cross domain check.

* Ignore disabled file inputs when submitting the form.

## v1.0.4

* Fix CSP bypass vulnerability.

  CVE-2015-1840.

  *Rafael Mendonça França*

## v1.0.3

* Replace deprecated `deferred.error()` with `fail()`.

  *Carlos Antonio da Silva*
## v1.0.2

* Re-enables buttons and links after going back through the `pageshow` event.

  *Gabriel Sobrinho*

## v1.0.1

* `confirm` is no longer called twice for `button` elements inside a `form`.

  *Lucas Mazza*

* `button` or submit inputs using the `form` attribute are properly bound.

  *Marnen Laibow-Koser*

## v1.0.0

* First tagged release.
