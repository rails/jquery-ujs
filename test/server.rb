require 'rubygems'
require 'sinatra'
require 'json'
require 'fileutils'

pwd = File.dirname(__FILE__)
puts pwd
source_file = File.join(pwd,  '..', 'src', 'rails.js')
dest_file = File.join(File.dirname(__FILE__), 'vendor', 'rails.js')

FileUtils.cp(source_file, dest_file)



after do
  puts request.xhr? ? 'AJAX request' : 'NOT AJAX request'
  ctype = request.xhr? ? 'application/json' : 'text/html'
  content_type ctype, :charset => 'utf-8'
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

