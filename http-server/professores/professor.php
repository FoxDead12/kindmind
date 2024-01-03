<?php
  include '../classes/Request.php';

  class Professor extends Request {
    public function execute () {

      $id_professor = $this->body['id'];

      if ($id_professor === null || $id_professor === '' || $id_professor === 0) {
        return $this->send_message('Invalid data!!', 400);
      }

      $professor = $this->db->execute_query('SELECT u.full_name, t.description, t.about_class, t.hour_payment, t.online, t.presencial FROM users u LEFT JOIN teacher_information t ON u.id = t.id_user WHERE u.id = ?', [$id_professor]);
      $subjects = $this->db->execute_query('SELECT s.id, s.name FROM teacher_subjects t INNER JOIN subjects s ON s.id = t.id_subject WHERE t.id_user = ?', [$id_professor]);
      $level_education = $this->db->execute_query('SELECT e.id, e.name FROM teacher_education_level t INNER JOIN education_level e ON e.id = t.id_level WHERE t.id_user = ?', [$id_professor]);

      $body = $professor->fetch_assoc();
      $body['subjects'] = [];
      $body['level_education'] = [];

      while ($row = $subjects->fetch_assoc()) {
        array_push($body['subjects'], $row);
      }

      while ($row = $level_education->fetch_assoc()) {
        array_push($body['level_education'], $row);
      }

      $this->send_message('', 200, $body);
    }
  }

  $job = new Professor('GET', true);
  $job->request();
?>
