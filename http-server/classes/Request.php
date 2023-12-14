<?php
  error_reporting(0);

  include 'exceptions/server-exception.php';
  include 'Mailer.php';
  include 'Token.php';

  class Request {
    public $db;
    private $method;
    private $transaction;
    public $response;
    public $body;
    protected $mailer;
    protected $token_manager;
    protected $env;
    protected $payload_token;
    private $protected;

    public function __construct($method, $protected = false, $transaction = false) {
      # Objects Declarations
      $this->mailer = new Mailer();
      $this->token_manager = new Token('AHSDHASDHASHDAHSDHAHDSAAS');
      $this->response = new stdClass();

      # Save body data
      $this->body = file_get_contents('php://input');
      $this->body = json_decode($this->body);
      if (!$this->body) {
        $this->body = $_GET;
      }

      $this->protected = $protected; # SET IF IS PROTECTED ROUTE
      $this->method = $method; # SET METHOD OF REQUEST
      $this->transaction = $transaction; # SET IF REQUEST OPEN A TRANSACTION

      # Execute configuration methods
      $this->setHeader();
      $this->setEnv();
    }

    public function request () {
      try {
        # Create connection width DB
        $this->db = new mysqli('localhost:3306', 'kindmind', 'kindmind', 'kindmind');

        # Validate request is correct
        $this->validateRequest();

        # Protect Method
        if ($this->protected === true) {
          $this->check_token();
        }

        # Create Transaction
        if ($this->transaction === true) {
          $this->db->begin_transaction();
        }

        # Execute code of request
        $this->execute();

        # Commit Transaction
        if ($this->transaction === true) {
          $this->log("COMMIT");
          $this->db->commit();
        }
      } catch (ServerException $e) {
        # Rollback Transaction
        if ($this->transaction === true) {
          $this->log("ROLLBACK");
          $this->db->rollback();
        }

        # Send controlled error!
        $this->send_message($e->getMessage(), $e->getCode());
      } catch (Exception $e) {

        # Rollback Transaction
        if ($this->transaction === true) {
          $this->log("ROLLBACK");
          $this->db->rollback();
        }
        error_log($e->getMessage());
        error_log($e->getTraceAsString());
        # Send unexpected error!
        $this->send_message("Algo correu mal, tente novamente mais tarde!", 501);
      }

      # Close connection DB
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

      # Transform response in json object
      $this->response = json_encode($this->response);
      # Set HTTP response CODE
      http_response_code($code);
      ini_set('output_buffering', 'off');
      ob_implicit_flush(true);
      # SEND RESPONSE
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
        # WHEN METHOD IS OPTIONS WILL ALWAYS RETURN SUCCESS RESPONSE
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
        http_response_code(200);
        die();
      }
    }

    private function setEnv () {
      $this->env = new stdClass();
      $this->env->url_front = 'http://localhost:5173/';
      $this->env->url_env = 'http://localhost:8000/';
    }

    protected function log ($data) {
      $message = print_r($data, true);
      error_log($message);
    }

    private function check_token () {
      # Get headers from request
      $headers = getallheaders();

      # Check headers hash a Authorization header
      if (!array_key_exists('Authorization', $headers)) {
        $this->send_message('No permissions to execute order!', 405);
      }

      # Check Authorization header is a Bearer
      if (substr($headers['Authorization'], 0, 7) !== 'Bearer ') {
        $this->send_message('No permissions to execute order!', 405);
      }

      # Get token
      $token = trim(substr($headers['Authorization'], 6));
      $payload = $this->token_manager->decode_token($token);
      $email = $payload->email;

      $result = $this->db->execute_query('SELECT id, role FROM users where email = ? AND activate = 1', [$email]);

      if ($result->num_rows !== 1) {
        $this->send_message('No permissions to execute order!', 405);
      }

      while ($row = $result->fetch_assoc()) {
        $payload->id = $row['id'];
        $payload->role = $row['role'];
      }

      $this->payload_token = $payload;
    }
  }
?>
