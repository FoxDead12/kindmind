<?php
	include '../classes/Request.php';

  class CreateProposal extends Request {
    public function execute () {
      $id_user = $this->payload_token->id;
      $role_user = $this->payload_token->role;
      $email_user = $this->payload_token->email;

      $date_class = $this->body->date_class;
      $message = $this->body->message;
      $to_professor = $this->body->to_professor;
      $duration = $this->body->duration;

      if ($message === null || $message === '' || $to_professor == null || $to_professor == '' || $duration == null || $duration == '') {
        return $this->send_message('Invalid data!!', 400);
      }

      if ($role_user != 0) {
        return $this->send_message('Invalid user to create proposal!', 400);
      }

      // Validate professor
      $professor = $this->db->execute_query('SELECT id, email FROM users WHERE role = 1 AND activate = 1 AND id = ?', [$to_professor]);
      $professor = $professor->fetch_assoc();
      if (!$professor) {
        return $this->send_message('Invalid professor select!', 400);
      }

      // CREATE PROPOSAL
      if ($date_class) {
        $this->log($date_class);
        $this->db->execute_query("INSERT INTO proposals (id_student, id_professor, class_time, duration , message) VALUES (?, ?, ?, ?, ?)", [$id_user, $professor['id'], $date_class, $duration, $message]);
      } else {
        $this->db->execute_query("INSERT INTO proposals (id_student, id_professor, duration , message) VALUES (?, ?, ?, ?)", [$id_user, $professor['id'], $duration, $message]);
      }

      $this->send_message('Proposal sent successfully!', 200);

      // SEND NOTIFICATIONS TO PROFESSOR AND USER EMAIL
      // To professor
      $body_email = 'You have just received a proposal on our platform.<br>Respond as quickly as possible to the user.';
      $this->mailer->send_email($professor['email'], 'New proposal', $body_email);


      $body_email = 'You have just sent a proposal, wait for a response.';
      $this->mailer->send_email($email_user, 'Request for Proposal', $body_email);

    }
  }

  $job = new CreateProposal('POST', true);
	$job->request();
?>
