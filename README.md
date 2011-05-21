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

- [jQuery 1.4.4][jquery] or later;
- for Ruby on Rails only: `<%= csrf_meta_tags %>` in the HEAD of your HTML layout (Rails 3.1)
- HTML5 doctype (optional).

If you don't use HTML5, adding "data" attributes to your HTML4 or XHTML pages might make them fail [W3C markup validation][validator]. However, this shouldn't create any issues for web browsers or other user agents.

Installation
------------

For automated installation in Rails, use the "jquery-rails" gem. Place this in your Gemfile:

    gem 'jquery-rails', '>= 1.0.3'

And run:

    $ bundle install

This next step depends on your version of Rails.

a. For Rails 3.1, add these lines to the top of your app/assets/javascripts/application.js file:

    //= require jquery
    //= require jquery_ujs

b. For Rails 3.0, run this command (add `--ui` if you want jQuery UI):

*Be sure to get rid of the rails.js file if it exists, and instead use
the new jquery_ujs.js file that gets copied to the public directory.
Choose to overwrite jquery_ujs.js if prompted.*

    $ rails generate jquery:install


### Manual installation

[Download jQuery][jquery] and ["rails.js"][adapter] and place them in your "javascripts" directory.

Configure the following in your application startup file:

    config.action_view.javascript_expansions[:defaults] = %w(jquery rails)

Now the template helper `javascript_include_tag :defaults` will generate SCRIPT tags to load jQuery and rails.js.

In Ruby on Rails 3.1, the `csrf_meta_tags` helper generates two meta tags containing values necessary for [cross-site request forgery protection][csrf] built into Rails. In Rails 3.0, the helper is named `csrf_meta_tag`. If you're using Rails 2, here is how to implement that helper:

    # app/helpers/application_helper.rb
    def csrf_meta_tag
      if protect_against_forgery?
        out = %(<meta name="csrf-param" content="%s"/>\n)
        out << %(<meta name="csrf-token" content="%s"/>)
        out % [ Rack::Utils.escape_html(request_forgery_protection_token),
                Rack::Utils.escape_html(form_authenticity_token) ]
      end
    end

[data]: http://dev.w3.org/html5/spec/elements.html#embedding-custom-non-visible-data-with-the-data-attributes "Embedding custom non-visible data with the data-* attributes"
[wiki]: https://github.com/rails/jquery-ujs/wiki
[events]: https://github.com/rails/jquery-ujs/wiki/ajax
[jquery]: http://docs.jquery.com/Downloading_jQuery
[validator]: http://validator.w3.org/
[csrf]: http://api.rubyonrails.org/classes/ActionController/RequestForgeryProtection.html
[adapter]: https://github.com/rails/jquery-ujs/raw/master/src/rails.js
