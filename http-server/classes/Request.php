<?php

  include 'exceptions/server-exception.php';
  class Request {
    public $db;
    private $method;
    public $response;

    public function __construct($method) {
      $this->response = new stdClass();
      $this->method = $method;
    }

    public function request () {
      try {
        $this->db = new mysqli('localhost:3306', 'kindmind', 'kindmind', 'kindmind'); # TODO
        $this->validateRequest(); # Validate if request is the same method defined
        $this->execute(); # Execute code of children class
      } catch (Exception $e) {
        error_log($e->getTraceAsString());
        $this->send_error("Algo correu mal, tente novamente mais tarde!", 501);
      } catch (ServerException $e) {
        $this->send_error($e->getMessage(), $e->getCode());
      }

      echo $this->response;
    }

    public function execute () {
      # METHOD TO RUN IN CHILDREN CLASS
    }

    private function validateRequest () {
      if ($_SERVER['REQUEST_METHOD'] !== $this->method) {
        throw new ServerException('Method Not Allowed', 405);
      }
    }

    protected function send_error ($message, $code) {
      $this->response->message = $message;
      $this->response->code = $code;
      header('Content-Type: application/json');
      http_response_code($code);
      $this->response = json_encode($this->response);
    }

    protected function send_success ($message, $code, $body = null) {
      $this->response->message = $message;
      $this->response->code = $code;
      if ($body) {
        $this->response->body = $body;
      }
      header('Content-Type: application/json');
      http_response_code($code);
      $this->response = json_encode($this->response);
    }
  }

?>


