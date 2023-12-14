<?php
  include '../classes/Request.php';

  class ProfileImage extends Request {
    public function execute () {

      $file = $_FILES['file'];
      if ($file == null || $file == '') {
        return $this->send_message('Invalid data!!', 400);
      }

      $upload_dir = realpath(getcwd(). DIRECTORY_SEPARATOR . '../../uploads/profiles');
      $file_new = uniqid() . mt_rand() . '.' . $file['name'];
      $upload_dir = $upload_dir . '/' . $file_new;
      move_uploaded_file($file['tmp_name'], $upload_dir);

      $url_out = $this->env->url_env . 'profile/file.php?name=' . $file_new;
      $this->send_message('File upload', 200, ['file_name' => $url_out]);
    }
  }

  $job = new ProfileImage('POST', true);
	$job->request();
?>
