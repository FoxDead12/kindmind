<?php
	include '../classes/Request.php';

	class Login extends Request {
		public function execute () {

      $email = $this->body->email;
      $password = $this->body->password;
      $keep_session = $this->body->session;
			// password_verify($entered_password, $stored_hashed_password)
			$this->send_success('MENSAGEM DE SUCESSO', 200);
		}
	}

	$job = new Login('POST');
	echo $job->request();
?>

