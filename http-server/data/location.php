<?php
	include '../classes/Request.php';
    
	class Location extends Request {
		public function execute () {
            //$cleanString = preg_replace('/[^A-Za-z0-9-]/', '', $inputString);

            $field = $this->body['field'];
            $field = preg_replace('/[^A-Za-z0-9-]/', '', $field);
            if ($field == null || $field == '') {
                return $this->send_message('Invalid data!!', 400);
              }
           // 'SELECT * FROM locations WHERE country LIKE %vsti%'

	}
}

	$job = new Location('GET',true);
	$job->request();
?>


