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

      // ob_end_clean();
      // header("Connection: close");
      // ignore_user_abort(); // optional
      // ob_start();
    }

    public function request () {
      try {
        $this->db = new mysqli('localhost:3306', 'kindmind', 'kindmind', 'kindmind'); # TODO
        $this->validateRequest(); # Validate if request is the same method defined
        $this->execute(); # Execute code of children class
      } catch (ServerException $e) {
        $this->send_error($e->getMessage(), $e->getCode());
      } catch (Exception $e) {
        error_log($e->getTraceAsString());
        $this->send_error("Algo correu mal, tente novamente mais tarde!", 501);
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

    protected function send_error ($message, $code) {
      $this->response->message = $message;
      $this->response->code = $code;
      header('Content-Type: application/json');
      http_response_code($code);
      $this->response = json_encode($this->response);
      echo $this->response;

      // $obSize = ob_get_length();
      // header("Content-Length: $obSize");
      // ob_end_flush();
      // flush();
      // session_write_close();
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
      echo $this->response;

      // $obSize = ob_get_length();
      // header("Content-Length: $obSize");
      // ob_end_flush();
      // flush();
      // session_write_close();
    }

    private function setHeader () {
      header('Access-Control-Allow-Origin: *');
    }

    private function setEnv () {
      $this->env = new stdClass();
      $this->env->url_front = 'http://localhost:5173/';
    }

    protected function generate_token () {

    }
  }

?>


