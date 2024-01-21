class Job
  def initialize (ws, body)
    @ws = ws
    @body = body
  end

  def start ()
    # Start message send
    begin
      self.execute
    rescue CloseConnection => e
      self.send_message(e.message, e.code, 'session')
      @ws.websocket.close_connection
    rescue StandardError => e # Server Errors
      self.send_message(e.message, 500, 'error')
    end
  end

  def send_message (message, code, type, body = nil)
    message_body = {
      message: message,
      code: code,
      body: body,
      type: type
    }.to_json

    @ws.websocket.send(message_body)
  end

  def payload_token (token)
    begin
      payload = JWT.decode token, 'AHSDHASDHASHDAHSDHAHDSAAS', 'HS256'
      return JSON.parse(payload.to_json, object_class: OpenStruct)[0]
    rescue => e
      raise CloseConnection.new 'The token is no longer valid, its validity period has expired!', 405
    end
  end

  def execute; end

end


# EXCEPTIONS #
class CloseConnection < StandardError
  attr_reader :code

  def initialize(message = "Connection closed", code)
    super(message)
    @code = code
  end
end
