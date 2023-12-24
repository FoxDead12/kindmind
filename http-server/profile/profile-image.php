<?php
  include '../classes/Request.php';

  class ProfileImage extends Request {
    public function execute () {

      $file = $_FILES['file'];
      if ($file == null || $file == '') {
        return $this->send_message('Invalid data!!', 400);
      }

      // Get image info
      $imgInfo = getimagesize($file['tmp_name']);
      $mime = $imgInfo['mime'];

      // Create a new image from file
      switch($mime){
        case 'image/jpeg':
          $image = imagecreatefromjpeg($file['tmp_name']);
          break;
        case 'image/png':
          $image = imagecreatefrompng($file['tmp_name']);
          break;
        case 'image/gif':
          $image = imagecreatefromgif($file['tmp_name']);
          break;
        case 'image/webp':
          return $this->send_message('Invalid type of image', 400);
          break;
        default:
          $image = imagecreatefromjpeg($file['tmp_name']);
      }

      // Set server directory
      $upload_dir = realpath(getcwd(). DIRECTORY_SEPARATOR . '../../uploads/profiles');
      $file_new = uniqid() . mt_rand() . '.' . explode('/', $file['type'])[1];
      $upload_dir = $upload_dir . '/' . $file_new;

      // Save image in directory
      imagejpeg($image, $upload_dir, 50);

      // Write URL of image
      $url_out = $this->env->url_env . 'profile/file.php?name=' . $file_new;
      $this->send_message('File upload', 200, ['file_name' => $url_out]);
    }
  }

  $job = new ProfileImage('POST', true);
	$job->request();
?>
