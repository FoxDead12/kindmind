<?php
	include '../classes/Request.php';

  class Proposals extends Request {
    public function execute () {

      $id_user = $this->payload_token->id;
      $role_user = $this->payload_token->role;

      $result = $this->db->execute_query ("
        SELECT p.id, p.id_student, p.id_professor, p.class_time, p.duration, p.message, p.activate
        FROM proposals p INNER JOIN users u ON u.id = p.id_professor WHERE p.id_student = ? ORDER BY p.create_at DESC
      ", [$id_user]);

      $proposals = array ();
      while ($row = $result->fetch_assoc()) {

        $professor = $this->db->execute_query ("SELECT id, email, full_name, image_url FROM users WHERE id = ? AND activate = 1", [$row["id_professor"]]);
        $professor = $professor->fetch_assoc();
        $row['professor'] = $professor;


        $messages = [];
        $messages_result = $this->db->execute_query ("SELECT pm.message, pm.id_from_user, pm.id_to_user, pm.create_at
          FROM proposals_message pm
          INNER JOIN proposals p ON pm.id_proposal = p.id
          WHERE p.id = ?
        ", [$row['id']]);

        while ($row_message = $messages_result->fetch_assoc()) {
          array_push ($messages, $row_message);
        }

        $row['messages'] = $messages;
        array_push($proposals, $row);
      }

      $body = ['result' => $proposals];
      $this->send_message('Proposals load successfully!', 200, $body);
    }
  }

  $job = new Proposals('GET', true);
	$job->request();
?>
