<?php

  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\SMTP;
  use PHPMailer\PHPMailer\Exception;

  require '../../vendor/autoload.php';

  class Mailer  {
    protected $mail;

    public function __construct() {
      $this->mail = new PHPMailer(true);

      // $this->mail->SMTPDebug = SMTP::DEBUG_SERVER;                   //Enable verbose debug output
      $this->mail->isSMTP();                                            //Send using SMTP
      $this->mail->Host       = 'smtp.gmail.com';                       //Set the SMTP server to send through
      $this->mail->SMTPAuth   = true;                                   //Enable SMTP authentication
      $this->mail->Username   = 'mail.manager.sender.01@gmail.com';     //SMTP username
      $this->mail->Password   = 'uiwjtaryzaauuqgw';                     //SMTP password
      $this->mail->SMTPSecure = 'tls';                                  //Enable implicit TLS encryption
      $this->mail->Port       = 587;
      $this->mail->SMTPAuth = true;
    }

    public function send_email ($to, $subject, $body) {
      $this->mail->setFrom('mail.manager.sender.01@gmail.com', 'KindMind');
      $this->mail->addAddress($to);
      $this->mail->IsHTML(true);                                  //Set email format to HTML
      $this->mail->Subject = $subject;
      $this->mail->Body    = $body;
      $this->mail->send();
    }

  }
?>
