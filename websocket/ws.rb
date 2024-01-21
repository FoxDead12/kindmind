require 'websocket-eventmachine-server'
require 'json'
require_relative './websocker_connection.rb'

EM.run do
  WebSocket::EventMachine::Server.start(host: 'localhost', port: 8001) do |ws|
    WebsocketConnection.new ws
    # ws.onopen do
    #   puts "WebSocket connection opened"
    # end

    # ws.onmessage do |msg, type|
    #   puts "Received message: #{msg}"
    #   ws.send("You sent: #{msg}")
    # end

    # ws.onclose do |code, reason|
    #   puts "WebSocket connection closed with code: #{code}, reason: #{reason}"
    # end
  end
end
