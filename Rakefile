desc %(Starts the test server and opens it in a web browser)
multitask :default => ['test:server', 'test:open']

PORT = 4567

namespace :test do
  desc %(Starts the test server)
  task :server do
    system 'bundle exec ruby test/server.rb'
  end

  desc %(Starts the test server which reloads everything on each refresh)
  task :reloadable do
    exec "bundle exec shotgun test/config.ru -p #{PORT} --server thin"
  end

  task :open do
    url = "http://localhost:#{PORT}"
    puts "Opening test app at #{url} ..."
    sleep 3
    system( *browse_cmd(url) )
  end
end

# Returns an array e.g.: ['open', 'http://example.com']
def browse_cmd(url)
  require 'rbconfig'
  browser = ENV['BROWSER'] ||
    (RbConfig::CONFIG['host_os'].include?('darwin') && 'open') ||
    (RbConfig::CONFIG['host_os'] =~ /msdos|mswin|djgpp|mingw|windows/ && 'start') ||
    %w[xdg-open x-www-browser firefox opera mozilla netscape].find { |comm| which comm }

  abort('ERROR: no web browser detected') unless browser
  Array(browser) << url
end

# which('ruby') #=> /usr/bin/ruby
def which cmd
  exts = ENV['PATHEXT'] ? ENV['PATHEXT'].split(';') : ['']
  ENV['PATH'].split(File::PATH_SEPARATOR).each do |path|
    exts.each { |ext|
      exe = "#{path}/#{cmd}#{ext}"
      return exe if File.executable? exe
    }
  end
  return nil
end
