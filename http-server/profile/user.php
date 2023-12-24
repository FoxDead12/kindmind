<?php
  include '../classes/Request.php';

  class User extends Request {
    public function execute () {
      $id_user = $this->payload_token->id;

      $user = $this->db->execute_query('SELECT * FROM users u LEFT JOIN teacher_information t on u.id = t.id_user LEFT JOIN locations l ON l.id = u.location_id WHERE u.id = ?;', [$id_user]);
      $body = null;

      while ($row = $user->fetch_assoc()) {
        $location = null;
        if ($row['location_id']) {
          $location = $row['country'] . ', ' . $row['city'];
        }

        $subjects = $this->db->execute_query("SELECT s.name as name FROM teacher_subjects ts INNER JOIN users u ON u.id = ts.id_user INNER JOIN subjects s ON s.id = ts.id_subject WHERE u.id = ?", [$id_user]);

        $body = [
          "full_name" => $row['full_name'],
          "image_url" => $row['image_url'],
          "location" => $location,
          "teacher" => [
            "payment" => $row['hour_payment'],
            "description" => $row['description'],
            "about_class" => $row['about_class'],
            "online" => $row['online'],
            "presencial" => $row['presencial'],
            "subjects" => $subjects->fetch_all()
          ]
        ];
      }

      $this->send_message('User information', 200, $body);
    }
  }

  $job = new User('GET', true);
	$job->request();
?>
