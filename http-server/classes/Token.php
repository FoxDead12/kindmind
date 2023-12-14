<?php
  use Firebase\JWT\JWT;
  use Firebase\JWT\Key;

  include './exceptions/server-exception.php';

  class Token {
    private $secret;

    public function __construct($secret) {
      $this->secret = $secret;
    }

    public function generate_token ($payload) {
      $jwt = JWT::encode($payload, $this->secret, 'HS256');
      return $jwt;
    }

    public function decode_token ($token) {
      try {
        $decoded = JWT::decode($token, new Key($this->secret, 'HS256'));
        return $decoded;
      } catch (Exception $e) {
        throw new ServerException('The token is no longer valid, its validity period has expired', 405);
      }
    }
  }
?>
