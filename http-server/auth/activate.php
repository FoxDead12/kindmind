<?php
	include '../classes/Request.php';

	class Activate extends Request {
		public function execute () {
      $token = $this->body->token;

      if ($token == null) {
        return $this->send_message('Invalid data!!', 400);
      }

      $payload = $this->token_manager->decode_token($token);
      $email = $payload->email;

      $user_result = $this->db->execute_query('SELECT activate FROM users where email = ?', [$email]);
      if ($user_result->num_rows != 1) {
        return $this->send_message('This account does not exist!', 400);
      }

      while ($row = $user_result->fetch_assoc()) {
        if ($row['activate'] === 1) {
          return $this->send_message('This account has already been activated!', 400);
        }
      }

      $result = $this->db->execute_query('UPDATE users SET activate = 1, update_at = CURRENT_TIMESTAMP WHERE email = ?', [$email]);
      $this->send_message('', 201);
		}
	}

	$job = new Activate('POST');
	$job->request();
?>


