<?php
	include '../classes/Request.php';

	class Register extends Request {
		public function execute () {

         $name = $this->body->name;
         $email = $this->body->email;
         $password = $this->body->password;
         $date = $this->body->date;
         $role = $this->body->role;

         $user_result = $this->db->execute_query('SELECT id FROM users where email = ?', [$email]);
         if ($user_result->num_rows > 0) {
            return $this->send_error('Already exist user width this email!', 400);
         }

         $hash = password_hash($password, PASSWORD_DEFAULT);
         $this->db->execute_query('INSERT INTO users (full_name, email, hash, role) VALUES (?, ?, ?, ?)', [$name, $email, $hash, $role]);

         $this->send_success('Your account was created to activate, just accept the email you will receive!', 201);

         $body_email = ' Estimado(a) ' . $name . '<br>Obrigado por criar conta na kindmind para ativar conta basta clicar no link abaixo.<br> Url: ' . $this->env->url_front . 'activate?token=TOKENGENERATE';
         $this->mailer->send_email($email, 'Welcome to KindMind', $body_email);
		}
	}

	$job = new Register('POST');
	$job->request();
?>

