<?php

  class Mailer  {
    public function send_email($to, $subject, $templateFile, $data = array()) {
      $message = file_get_contents( '../../mail/'.$templateFile, FILE_USE_INCLUDE_PATH);

      // Replace placeholders in the template with actual data
      foreach ($data as $key => $value) {
        $placeholder = '{' . strtoupper($key) . '}';
        $message = str_replace($placeholder, $value, $message);
      }

      // Additional email headers
      $headers = "MIME-Version: 1.0" . "\r\n";
      $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
      $headers .= 'From: your_email@example.com' . "\r\n";

      // Send the email
      mail($to, $subject, $message, $headers);
    }
  }
?>
