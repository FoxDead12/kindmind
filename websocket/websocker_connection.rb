require 'mysql'
require 'jwt'
require_relative './jobs/auth_session.rb'
require_relative './jobs/message.rb'

class WebsocketConnection
  attr_accessor :websocket, :db, :user
  @@connections = Array.new

  def initialize (ws)
    @user = nil
    @websocket = ws

    @websocket.onopen do |handshake|
      self.connection_stablish handshake
    end

    @websocket.onmessage do |msg, type|
      self.message_recived msg, type
    end

    @websocket.onclose do |code, reason|
      puts "WebSocket connection closed with code: #{code}, reason: #{reason}"

      index_to_remove = nil
      @@connections.each_with_index do |connection, idx|
        if (connection === self)
          index_to_remove = idx
        end
      end

      if (!index_to_remove.nil?)
        @@connections.delete_at index_to_remove
      end
    end
  end

  def connection_stablish (handshake)
    puts "New connection"
    @@connections << self
    @db = Mysql.connect('mysql://kindmind:kindmind@127.0.0.1:3306/kindmind')
    @connection_is_save = false # Will become true if token in first message was valid
  end

  def message_recived (msg, type)
    body = JSON.parse(msg, object_class: OpenStruct)

    # Check type of message
    job = self.initialize_job(body)
    job.start()
  end

  def initialize_job (body)
    case body[:type]
      when 'session'
        AuthSession.new self, body
      when 'message'
        Message.new self, body
    end
  end

  def get_connections ()
    @@connections
  end
end
