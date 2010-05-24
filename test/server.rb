#
# SETTINGS 
#
BASE_URL = 'http://localhost'
PORT = 4567
AJAX_TIMEOUT = 5000



require 'rubygems'
require 'sinatra'
require 'json'
require 'fileutils'

# copy rails.js file from src to vendor directory
source_file = File.join( File.dirname(__FILE__) ,  '..', 'src', 'rails.js')
dest_file = File.join(File.dirname(__FILE__), 'public', 'vendor', 'rails.js')
FileUtils.cp(source_file, dest_file)

after do
  ctype = request.xhr? ? 'application/json' : 'text/html'
  content_type ctype, :charset => 'utf-8'
  
  @base_url = BASE_URL
  @port = PORT
  @ajax_timeout = AJAX_TIMEOUT
end

get '/' do
  erb :index
end

get '/show' do
  if request.xhr?
    {:hello => :sexy, :request_env => request.env}.to_json
  else
    '/show requested without ajax'
  end
end

get '/error' do
  status 403
end

post '/update' do
  if request.xhr?
    {:hello => :sexy, :request_env => request.env}.to_json
  else
    '/update requested without ajax'
  end
end

get '/iframe' do
  erb :iframe
end

get '/iframe-csrf' do
  erb :iframe_csrf
end

delete '/delete' do
  "/delete was invoked with delete verb. params is #{params.inspect}"
end
