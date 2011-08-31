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

- [jQuery 1.6][jquery] or later;
- HTML5 doctype (optional).

If you don't use HTML5, adding "data" attributes to your HTML4 or XHTML pages might make them fail [W3C markup validation][validator]. However, this shouldn't create any issues for web browsers or other user agents.

Installation
------------

For automated installation in Rails, use the "jquery-rails" gem. Place this in your Gemfile:

```ruby
gem 'jquery-rails', '>= 1.0.12'
```

And run:

    $ bundle install

This next step depends on your version of Rails.

a. For Rails 3.1, add these lines to the top of your app/assets/javascripts/application.js file:

```javascript
//= require jquery
//= require jquery_ujs
```

b. For Rails 3.0, run this command (add `--ui` if you want jQuery UI):

*Be sure to get rid of the rails.js file if it exists, and instead use
the new jquery_ujs.js file that gets copied to the public directory.
Choose to overwrite jquery_ujs.js if prompted.*

    $ rails generate jquery:install


### Manual installation (including Rails 2)

[Download jQuery][jquery] and ["rails.js"][adapter] and place them in your "javascripts" directory.

Configure the following in your application startup file:

```ruby
  config.action_view.javascript_expansions[:defaults] = %w(jquery rails)
```

Now the template helper `javascript_include_tag :defaults` will generate SCRIPT tags to load jQuery and rails.js.

For Rails 2, you will need to manually implement the `csrf_meta_tag` helper and include it inside the `<head>` of your application layout.

The `csrf_meta_tags` (Rails 3.1) and `csrf_meta_tag` (Rails 3.0) helpers generate two meta tags containing values necessary for the [cross-site request forgery protection][csrf] built into Rails. Here is how to implement that helper in Rails 2:

```ruby
  # app/helpers/application_helper.rb
  def csrf_meta_tag
    if protect_against_forgery?
      out = %(<meta name="csrf-param" content="%s"/>\n)
      out << %(<meta name="csrf-token" content="%s"/>)
      out % [ Rack::Utils.escape_html(request_forgery_protection_token),
              Rack::Utils.escape_html(form_authenticity_token) ]
    end
  end
```

[data]: http://dev.w3.org/html5/spec/elements.html#embedding-custom-non-visible-data-with-the-data-attributes "Embedding custom non-visible data with the data-* attributes"
[wiki]: https://github.com/rails/jquery-ujs/wiki
[events]: https://github.com/rails/jquery-ujs/wiki/ajax
[jquery]: http://docs.jquery.com/Downloading_jQuery
[validator]: http://validator.w3.org/
[csrf]: http://api.rubyonrails.org/classes/ActionController/RequestForgeryProtection.html
[adapter]: https://github.com/rails/jquery-ujs/raw/master/src/rails.js
