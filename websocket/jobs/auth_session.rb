require_relative '../job.rb'


class AuthSession < Job
  def execute ()
    # Logic of validate session
    token = @body[:token]
    raise CloseConnection.new 'Invalid token!', 405 if (!token)

    payload = self.payload_token(token)

    # Get user
    user = self.get_user payload[:email]
    if (user.nil?)
      raise CloseConnection.new 'User doesnt exist!', 405
    end

    @ws.user = user
    self.send_message('Valide session', 200, 'session')
  end

  def get_user (email_payload)
    user = nil
    query = @ws.db.prepare("SELECT id, email, full_name FROM users WHERE email = ? AND activate = 1")
    query.execute email_payload
    query.each do |id, email, full_name|
      user = {
        id: id,
        email: email,
        full_name: full_name
      }
    end

    return user
  end
end
