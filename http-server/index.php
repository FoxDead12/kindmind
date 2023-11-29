<?php
	include './classes/Request.php';

	class Example extends Request {
		public function __construct($method) {
			parent::__construct($method);
		}

		public function execute () {
			$this->send_success('MENSAGEM DE SUCESSO', 200);
		}
	}

	$job = new Example('POST'); # Just need declare the class, will execute request
	echo $job->request(); # Start request action
?>
