<?php
  include '../classes/Request.php';

  class Validation extends Request {
    public function execute () {

      $email = $this->payload_token->email;

      $user_result = $this->db->execute_query('SELECT full_name, email, role FROM users where email = ?', [$email]);
      $user = null;
      while ($row = $user_result->fetch_assoc()) {
        $user = $row;
      }

      $this->send_message('Valid session!', 200, $user);
    }
  }

	$job = new Validation('GET', true);
	echo $job->request();
?>
