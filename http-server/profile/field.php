<?php
  include '../classes/Request.php';

  class Field extends Request {
    public function execute () {
      $email = $this->payload_token->email;
      $id_user = $this->payload_token->id;
      $field = $this->body['field'];

      if ($field == null || $field == '') {
        return $this->send_message('Invalid data!!', 400);
      }

      $result = $this->db->execute_query('SELECT * FROM users u INNER JOIN teacher_information t on u.id = t.id_user LEFT JOIN locations l ON l.id = u.location_id  where u.email = ?', [$email]);

      $body = null;
      if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
          switch ($field) {
            case 'about': $body = ['value' => $row['description']]; break;
            case 'location':
              $body = ["value" => $row['location_id']];break;
            case 'payment':
              $body = ['value' => $row['hour_payment']]; break;
            case 'presencial':
              $body = ['value' => $row['presencial']]; break;
            case 'online':
              $body = ['value' => $row['online']]; break;
            case 'about-class':
              $body = ['value' => $row['about_class']]; break;
            case 'image':
              $body = ['value' => $row['image_url']]; break;
            case 'subjects':
              $subjects = $this->get_user_subjects($id_user);
              $body = ['value' => $subjects]; break;
              break;
          }
        }
      }

      $this->send_message('Field read!', 200, $body);
    }

    private function get_user_subjects ($id_user) {
      $subjects = $this->db->execute_query('SELECT * FROM teacher_subjects ts INNER JOIN subjects s ON ts.id_subject = s.id WHERE id_user = ?;', [$id_user]);
      return $subjects->fetch_all();
    }
  }

  $job = new Field('GET', true);
	$job->request();
?>
