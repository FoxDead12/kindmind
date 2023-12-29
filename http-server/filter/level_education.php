<?php
  include '../classes/Request.php';

  class LeveEducation extends Request {
    public function execute () {

      $search_value = $this->body['value'];
      if ($search_value === null) {
        return $this->send_message('Invalid data!!', 400);
      }

      $this->log($search_value);
      $search_value = '%'.$search_value.'%';
      $result = $this->db->execute_query('SELECT * FROM education_level WHERE name LIKE (?)', [$search_value]);
      $body = ['result' => $result->fetch_all()];

      $this->send_message('', 200, $body);
    }
  }

  $job = new LeveEducation('GET', true);
	$job->request();
?>
