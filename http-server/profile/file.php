<?php
  include '../classes/Request.php';

  class File extends Request {
    public function execute () {

      $name = $this->body['name'];
      if ($name == null || $name == '') {
        return $this->send_message('Invalid data!!', 400);
      }

      $upload_dir = realpath(getcwd(). DIRECTORY_SEPARATOR . '../../uploads/profiles');

      $file = $upload_dir . '/' . $name;
      $fileContents = file_get_contents($file);
      header("Content-Type: image/jpeg");
      echo $fileContents;
    }
  }

  $job = new File('GET');
	$job->request();
?>
