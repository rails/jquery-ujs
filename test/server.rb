require 'sinatra'
require 'json'

use Rack::Static, :urls => ["/src"], :root => File.expand_path('..', settings.root)

helpers do
  def jquery_link version
    if params[:version] == version
      "[#{version}]"
    else
      "<a href='/?version=#{version}'>#{version}</a>"
    end
  end
  
  def jquery_src
    if params[:version] == 'edge' then "/vendor/jquery.js"
    else "http://code.jquery.com/jquery-#{params[:version]}.js"
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
end

get '/' do
  params[:version] ||= '1.4.4'
  erb :index
end

[:get, :post, :put, :delete].each do |method|
  send(method, '/echo') {
    data = { :params => params }.update(request.env)
    
    if request.xhr?
      content_type 'application/json'
      data.to_json
    elsif params[:iframe]
      <<-HTML
        <script>window.top.jQuery.event.trigger('iframe:loaded', #{data.to_json})</script>
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

post '/header' do
  status 200
  header_key = "HTTP_#{params[:key].upcase.gsub("-", "_")}"
  env[header_key].to_s
end
