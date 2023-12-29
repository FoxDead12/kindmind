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
            case 'level_education':
              $level = $this->get_user_level_education($id_user);
              $body = ['value' => $level]; break;
              break;
          }
        }
      }

      $this->send_message('Field read!', 200, $body);
    }

    private function get_user_subjects ($id_user) {
      $subjects = $this->db->execute_query('SELECT s.id, s.name FROM users u INNER JOIN teacher_subjects ts ON u.id = ts.id_user INNER JOIN subjects s ON ts.id_subject = s.id WHERE u.id = ?;', [$id_user]);
      return $subjects->fetch_all();
    }

    private function get_user_level_education ($id_user) {
      $level_education = $this->db->execute_query('SELECT el.id, el.name FROM users u INNER JOIN teacher_education_level te ON u.id = te.id_user INNER JOIN education_level el ON te.id_level = el.id WHERE u.id = ?', [$id_user]);
      return $level_education->fetch_all();
    }
  }

  $job = new Field('GET', true);
	$job->request();
?>
