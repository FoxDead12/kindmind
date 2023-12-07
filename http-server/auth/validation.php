<?php
  include '../classes/Request.php';

  use Symfony\Component\Yaml\Yaml;

  class Validation extends Request {
    public function execute () {

      $email = $this->payload_token->email;

      $user_result = $this->db->execute_query('SELECT full_name, email, role FROM users where email = ?', [$email]);
      $user = null;
      while ($row = $user_result->fetch_assoc()) {
        $user = $row;
      }

      $file_navigation = Yaml::parse(file_get_contents('../config/navigation.yml'), Yaml::PARSE_OBJECT_FOR_MAP);

      $navigation_headers = [];
      foreach ($file_navigation as &$navigation) {
        if (in_array($user['role'], $navigation->role)) {
          array_push ($navigation_headers, $navigation);
        }
      }

      $body = [
        "user" => $user,
        "headers" => $navigation_headers # USER HEADER HAS PERMISSION
      ];

      $this->send_message('Valid session!', 200, $body);
    }
  }

	$job = new Validation('GET', true);
	echo $job->request();
?>
