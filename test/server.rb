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
  
  def ajax_json_or_error
    if request.xhr?
      content_type 'application/json'
      data = yield
      String === data ? data : data.to_json
    else
      content_type 'text/plain'
      status 400
      "#{request.path} requested without ajax"
    end
  end
end

get '/' do
  params[:version] ||= '1.4.4'
  erb :index
end

[:get, :post, :put, :delete].each do |method|
  send(method, '/echo') {
    ajax_json_or_error do
      { :request_env => request.env }
    end
  }
end

get '/iframe' do
  erb :iframe
end

delete '/delete' do
  "/delete was invoked with delete verb. params is #{params.inspect}"
end

get '/error' do
  status 403
end
