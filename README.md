Unobtrusive scripting adapter for jQuery
========================================

This unobtrusive scripting support file is developed for the Ruby on Rails framework, but is not strictly tied to any specific backend. You can drop this into any application to:

- force confirmation dialogs for various actions;
- make non-GET requests from hyperlinks;
- make forms or hyperlinks submit data asynchronously with Ajax;
- have submit buttons become automatically disabled on form submit to prevent double-clicking.

These features are achieved by adding certain ["data" attributes][data] to your HTML markup. In Rails, they are added by the framework's template helpers.

Full [documentation is on the wiki][wiki], including the [list of published Ajax events][events].

Requirements
------------

- [jQuery 1.4.3][jquery] or later;
- for Ruby on Rails only: `<%= csrf_meta_tag %>` in the HEAD of your HTML layout;
- HTML5 doctype (optional).

If you don't use HTML5, adding "data" attributes to your HTML4 or XHTML pages might make them fail [W3C markup validation][validator]. However, this shouldn't create any issues for web browsers or other user agents.

In Ruby on Rails 3, the `csrf_meta_tag` helper generates two meta tags containing values necessary for [cross-site request forgery protection][csrf] built into Rails. If you're using Rails 2, here is how to implement that helper:

    # app/helpers/application_helper.rb
    def csrf_meta_tag
      if protect_against_forgery?
        out = %(<meta name="csrf-param" content="%s"/>\n)
        out << %(<meta name="csrf-token" content="%s"/>)
        out % [ Rack::Utils.escape_html(request_forgery_protection_token),
                Rack::Utils.escape_html(form_authenticity_token) ]
      end
    end

Installation
------------

For automated installation, use the "jquery-rails" generator:

    # Gemfile
    gem 'jquery-rails', '>= 0.2.6'

And run this command (add `--ui` if you want jQuery UI):

    $ bundle install
    $ rails generate jquery:install

This will remove the Prototype.js library from Rails, add latest jQuery library and fetch the adapter. Be sure to choose to overwrite the "rails.js" file.

### Manual installation

[Download jQuery][jquery] and ["rails.js"][adapter] and place them in your "javascripts" directory.

Configure the following in your application startup file:

    config.action_view.javascript_expansions[:defaults] = %w(jquery rails)

Now the template helper `javascript_include_tag :defaults` will generate SCRIPT tags to load jQuery and rails.js.


[data]: http://dev.w3.org/html5/spec/elements.html#embedding-custom-non-visible-data-with-the-data-attributes "Embedding custom non-visible data with the data-* attributes"
[wiki]: https://github.com/rails/jquery-ujs/wiki
[events]: https://github.com/rails/jquery-ujs/wiki/ajax
[jquery]: http://docs.jquery.com/Downloading_jQuery
[validator]: http://validator.w3.org/
[csrf]: http://api.rubyonrails.org/classes/ActionController/RequestForgeryProtection.html
[adapter]: https://github.com/rails/jquery-ujs/raw/master/src/rails.js
