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
    protected $payload_token;
    private $protected;

    public function __construct($method, $protected = false) {
      $this->protected = $protected;
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
        if ($this->protected === true) {$this->check_token();}
        $this->execute(); # Execute code of children class
      } catch (ServerException $e) {
        $this->send_message($e->getMessage(), $e->getCode());
      } catch (Exception $e) {
        error_log($e->getTraceAsString());
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

    protected function send_message ($message, $code, $body = null) {
      $this->response->message = $message;
      $this->response->code = $code;
      if ($body) {
        $this->response->body = $body;
      }

      // JSON OBJECT
      $this->response = json_encode($this->response);

      http_response_code($code);

      ini_set('output_buffering', 'off');
      // Enable implicit flush
      ob_implicit_flush(true);

      // SET BODY
      echo $this->response;

      flush();
      ob_flush();
    }

    private function setHeader () {
      header('Content-Type: application/json');
      header('Access-Control-Allow-Origin: *');
      header('Access-Control-Allow-Credentials: true');
      header('Access-Control-Allow-Methods: POST, PUT, PATCH, GET, DELETE, OPTIONS');
      header('Access-Control-Allow-Headers: *');

      if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
        http_response_code(200);
        die();
      }
    }

    private function setEnv () {
      $this->env = new stdClass();
      $this->env->url_front = 'http://localhost:5173/';
    }

    protected function log ($data) {
      $message = print_r($data, true);
      error_log($message);
    }

    private function check_token () {
      $headers = getallheaders();
      if (!array_key_exists('Authorization', $headers)) {
        $this->send_message('No permissions to execute order!', 405);
      }

      if (substr($headers['Authorization'], 0, 7) !== 'Bearer ') {
        $this->send_message('No permissions to execute order!', 405);
      }

      $token = trim(substr($headers['Authorization'], 6));
      $payload = $this->token_manager->decode_token($token);
      $email = $payload->email;

      $result = $this->db->execute_query('SELECT id FROM users where email = ? AND activate = 1', [$email]);

      if ($result->num_rows !== 1) {
        $this->send_message('No permissions to execute order!', 405);
      }

      $this->payload_token = $payload;
    }
  }

?>
