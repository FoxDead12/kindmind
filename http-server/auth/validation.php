<?php
  include '../classes/Request.php';

  class Validation extends Request {
    public function execute () {
      $this->send_message('', 200);
    }
  }

	$job = new Validation('GET', true);
	echo $job->request();
?>
