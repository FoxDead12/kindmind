<?php
	include '../classes/Request.php';
    
	class Location extends Request {
		public function execute () {
            $field = $this->body['field'];
            $field = preg_replace('/[^A-Za-z0-9-]/', '', $field);
            if ($field == null || $field == '') {
                return $this->send_message('Invalid data!!', 400);
              }
            $field = '%'.$field.'%';
            $result = $this->db->execute_query('SELECT * FROM locations WHERE country LIKE (?)',[$field]);
            $body = ['result' => $result->fetch_all()];  
            
            $this->send_message('', 200, $body)
	}
}

	$job = new Location('GET',true);
	$job->request();
?>


