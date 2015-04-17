require 'sinatra'
require 'json'

JQUERY_VERSIONS = %w[ 1.8.0 1.8.1 1.8.2 1.8.3 1.9.0 1.9.1 1.10.0 1.10.1 1.10.2 1.11.0 2.0.0 2.1.0].freeze

use Rack::Static, :urls => ["/src"], :root => File.expand_path('..', settings.root)

helpers do
  def jquery_link version
    if params[:version] == version
      "[#{version}]"
    else
      "<a href='/?version=#{version}&cdn=#{params[:cdn]}'>#{version}</a>"
    end
  end

  def cdn_link cdn
    if params[:cdn] == cdn
      "[#{cdn}]"
    else
      "<a href='/?version=#{params[:version]}&cdn=#{cdn}'>#{cdn}</a>"
    end
  end

  def jquery_src
    if params[:version] == 'edge'
      "/vendor/jquery.js"
    elsif params[:cdn] && params[:cdn] == 'googleapis'
      "https://ajax.googleapis.com/ajax/libs/jquery/#{params[:version]}/jquery.min.js"
    else
      "http://code.jquery.com/jquery-#{params[:version]}.js"
    end
  end

  def test *names
    names = ["/vendor/qunit.js", "settings"] + names
    names.map { |name| script_tag name }.join("\n")
  end

  def script_tag src
    src = "/test/#{src}.js" unless src.index('/')
    %(<script src="#{src}" type="text/javascript"></script>)
  end

  def jquery_versions
    JQUERY_VERSIONS
  end
end

get '/' do
  params[:version] ||= ENV['JQUERY_VERSION'] || '1.11.0'
  params[:cdn] ||= 'jquery'
  erb :index
end

[:get, :post, :put, :delete].each do |method|
  send(method, '/echo') {
    data = { :params => params }.update(request.env)

    if request.xhr?
      content_type 'application/json'
      data.to_json
    elsif params[:iframe]
      payload = data.to_json.gsub('<', '&lt;').gsub('>', '&gt;')
      <<-HTML
        <script>
          if (window.top && window.top !== window)
            window.top.jQuery.event.trigger('iframe:loaded', #{payload})
        </script>
        <p>You shouldn't be seeing this. <a href="#{request.env['HTTP_REFERER']}">Go back</a></p>
      HTML
    else
      content_type 'text/plain'
      status 400
      "ERROR: #{request.path} requested without ajax"
    end
  }
end

get '/error' do
  status 403
end
