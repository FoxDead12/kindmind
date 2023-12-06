<?php
	include '../classes/Request.php';

	class Login extends Request {
		public function execute () {

      $email = $this->body->email;
      $password = $this->body->password;
      $keep_session = $this->body->session;

			if ($email === null || $password == null || $keep_session === null) {
				return $this->send_message('Invalid data!!', 400);
			}

			$result = $this->db->execute_query('SELECT email, hash, id FROM users WHERE email = ? AND activate = 1', [$email]);

			if ($result->num_rows === 0) {
				return $this->send_message('There is no account with this email!', 400);
			}

			$user = null;
			while ($row = $result->fetch_assoc()) {
				$user = $row;
      }

			$isValid = password_verify($password, $user['hash']);
			if (!$isValid) {
				return $this->send_message('This account does not exist!', 400);
			}

			$default_time = time() + (60 * 60); // 1 hour

			if ($keep_session === true) {
				$default_time = time() + (60 * 60 * 24); // 24 hours
			}

			$token = $this->token_manager->generate_token(["email" => $email, "exp" => $default_time]);
			$this->send_message('Login was successful!', 201, ['token' => $token]);
		}
	}

	$job = new Login('POST');
	echo $job->request();
?>
