<?php
	include '../classes/Request.php';

	class Register extends Request {
		public function execute () {
         $name = $this->body->name;
         $email = $this->body->email;
         $password = $this->body->password;
         $date = $this->body->date;
         $role = $this->body->role;

         if ($name === null || $email == null || $password === null || $date === null || $role === null) {
            return $this->send_message('Invalid data!!', 400);
         }

         $user_result = $this->db->execute_query('SELECT id FROM users where email = ?', [$email]);
         if ($user_result->num_rows > 0) {
            return $this->send_message('Already exist user width this email!', 400);
         }

         $hash = password_hash($password, PASSWORD_DEFAULT);
         $this->db->execute_query('INSERT INTO users (full_name, email, hash, role) VALUES (?, ?, ?, ?)', [$name, $email, $hash, $role]);

         $this->send_message('Your account was created to activate, just accept the email you will receive!', 201);
         $token = $this->token_manager->generate_token(["email" => $email, "exp" => (time() + (5 * 60))]);

         $body_email = ' Estimado(a) ' . $name . '.<br>Obrigado por criar conta na kindmind para ativar conta basta clicar no link abaixo.<br><a href="' . $this->env->url_front . 'activate?token=' . $token . '">CLICK HERE</a>';
         $this->mailer->send_email($email, 'Welcome to KindMind', $body_email);
		}
	}

	$job = new Register('POST');
	$job->request();
?>

