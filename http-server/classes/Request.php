<?php
  error_reporting(0);

  include 'exceptions/server-exception.php';
  include 'Mailer.php';
  include 'Token.php';

  class Request {
    public $db;
    private $method;
    public $response;
    public $body;
    protected $mailer;
    protected $token_manager;
    protected $env;

    public function __construct($method) {
      $this->response = new stdClass();
      $this->mailer = new Mailer();
      $this->token_manager = new Token('AHSDHASDHASHDAHSDHAHDSAAS');
      $this->body = file_get_contents('php://input');
      $this->body = json_decode($this->body);
      $this->method = $method;
      $this->setHeader();
      $this->setEnv();
    }

    public function request () {
      try {
        $this->db = new mysqli('localhost:3306', 'kindmind', 'kindmind', 'kindmind'); # TODO
        $this->validateRequest(); # Validate if request is the same method defined
        $this->execute(); # Execute code of children class
      } catch (ServerException $e) {
        $this->send_message($e->getMessage(), $e->getCode());
      } catch (Exception $e) {
        error_log($e->getTraceAsString(), false);
        $this->send_message("Algo correu mal, tente novamente mais tarde!", 501);
      }

      $this->db->close();
    }

    public function execute () {
      # METHOD TO RUN IN CHILDREN CLASS
    }

    private function validateRequest () {
      if ($_SERVER['REQUEST_METHOD'] !== $this->method) {
        throw new ServerException('Method Not Allowed', 404);
      }
    }

    protected function send_message ($message, $code, $flush = true, $body = null) {
      $this->response->message = $message;
      $this->response->code = $code;
      if ($body) {
        $this->response->body = $body;
      }

      // JSON OBJECT
      $this->response = json_encode($this->response);

      http_response_code($code);

      // SET BODY
      echo $this->response;

      flush();
      ob_flush();
    }

    private function setHeader () {
      header('Access-Control-Allow-Origin: *');
      header('Content-Type: application/json');
    }

    private function setEnv () {
      $this->env = new stdClass();
      $this->env->url_front = 'http://localhost:5173/';
    }

    protected function generate_token () {

    }
  }

?>


