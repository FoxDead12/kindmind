require_relative '../job.rb'

class Message < Job
  def execute ()

    message = @body[:message]
    to = @body[:to]
    proposal_id = @body[:proposal_id]

    if (message.nil? || to.nil? || proposal_id.nil?)
      return self.send_message('Invalid data', 400, 'message')
    end

    query = @ws.db.prepare ("INSERT INTO proposals_message (id_from_user, id_to_user, message, id_proposal) VALUES (?, ?, ?, ?)")
    query.execute @ws.user[:id], to, message, proposal_id

    con = @ws.get_connections

    if (con.length > 0)
      con.each do |connection|
        if (connection.user[:id] === to)
          message_body = {
            message: 'New message',
            from: @ws.user[:email],
            message_body: message,
            type: 'message-received'
          }.to_json

          connection.websocket.send (message_body)
        end
      end
    end

    self.send_message('Message send', 200, 'message-send')
  end

end
