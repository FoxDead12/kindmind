<?php
  include '../classes/Request.php';

  class Professores extends Request {
    public function execute () {

      $result_professores = $this->db->execute_query('SELECT u.id, u.full_name, u.image_url, l.country, l.city, t.hour_payment, t.description, t.about_class, t.online, t.presencial, GROUP_CONCAT(s.name) as subjects FROM users u INNER JOIN teacher_information t ON u.id = t.id_user LEFT JOIN locations l ON l.id = u.location_id LEFT JOIN (SELECT s.name, t.id_user FROM teacher_subjects t INNER JOIN subjects s ON t.id_subject = s.id) as s ON s.id_user = u.id WHERE role = 1 AND activate = 1 AND valid = 1 GROUP BY u.id, t.id');

      $professores = array();
      while ($row = $result_professores->fetch_assoc()) {

        if ($row['subjects']) {
          $row['subjects'] = explode(',', $row['subjects']);
        }

        array_push($professores, $row);
      }

      $body = ['result' => $professores];

      $this->send_message('', 200, $body);
    }
  }

  $job = new Professores('GET', true);
	$job->request();
?>
