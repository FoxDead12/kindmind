<?php
	include '../classes/Request.php';

  class EditProfile extends Request {
    public function execute () {
      $email = $this->payload_token->email;
      $id_user = $this->payload_token->id;
      $field = $this->body->field;
      $value = $this->body->value;

      if ($value === null || $value === '' || $field == null || $field == '') {
        return $this->send_message('Invalid data!!', 400);
      }

      $validate = $this->db->execute_query('SELECT * FROM users u INNER JOIN teacher_information t on u.id = t.id_user where u.email = ?', [$email]);
      if ($validate->num_rows === 0) {
        $this->db->execute_query("INSERT INTO teacher_information (id_user) VALUES (?)", [$id_user]);
      }

      switch ($field) {
        case 'about':
          $this->update_about($value, $id_user); break;
        case 'location':
          $this->update_location($value, $id_user); break;
        case 'payment':
          $this->update_payment($value, $id_user); break;
          case 'presencial':
            $this->update_presencial($value, $id_user); break;
          case 'online':
            $this->update_online($value, $id_user); break;
          case 'about-class':
            $this->update_about_class($value, $id_user); break;
          case 'image':
            $this->update_image($value, $id_user); break;
          case 'subjects':
            $this->update_subjects($value, $id_user); break;
          case 'level_education':
            $this->update_levels_education($value, $id_user); break;
        default:
          throw new ServerException('Field doesn`t existe!', 404);
      }

      $this->send_message('Field changed successfully!', 200);
    }

    private function update_about ($value, $id_user) {
      if ($this->payload_token->role != 1) {
        return $this->send_message("This user don't contain this data!", 400);
      }
      $this->db->execute_query("UPDATE teacher_information SET description = ? WHERE id_user = ?", [$value, $id_user]);
    }

    private function update_location ($value, $id_user) {
      $this->db->execute_query("UPDATE users SET location_id = ? WHERE id = ? ", [$value, $id_user]);
    }

    private function update_payment ($value, $id_user) {
      if ($this->payload_token->role != 1) {
        return $this->send_message("This user don't contain this data!", 400);
      }
      $this->db->execute_query("UPDATE teacher_information SET hour_payment = ? WHERE id_user = ? ", [$value, $id_user]);
    }

    private function update_presencial ($value, $id_user) {
      if ($this->payload_token->role != 1) {
        return $this->send_message("This user don't contain this data!", 400);
      }
      $this->db->execute_query("UPDATE teacher_information SET presencial = ? WHERE id_user = ? ", [$value, $id_user]);
    }

    private function update_online ($value, $id_user) {
      if ($this->payload_token->role != 1) {
        return $this->send_message("This user don't contain this data!", 400);
      }
      $this->db->execute_query("UPDATE teacher_information SET online = ? WHERE id_user = ? ", [$value, $id_user]);
    }

    private function update_about_class ($value, $id_user) {
      if ($this->payload_token->role != 1) {
        return $this->send_message("This user don't contain this data!", 400);
      }
      $this->db->execute_query("UPDATE teacher_information SET about_class = ? WHERE id_user = ? ", [$value, $id_user]);
    }

    private function update_image ($value, $id_user) {
      $this->db->execute_query("UPDATE users SET image_url = ? WHERE id = ? ", [$value, $id_user]);
    }

    private function update_subjects ($value, $id_user) {
      $this->db->execute_query("DELETE FROM teacher_subjects WHERE id_user = ?", [$id_user]);
      foreach ($value as $subject) {
        $this->db->execute_query("INSERT INTO teacher_subjects (id_user,id_subject) VALUES (?, ?)", [$id_user, $subject->id]);
      }
    }

    private function update_levels_education ($value, $id_user) {
      $this->db->execute_query("DELETE FROM teacher_education_level WHERE id_user = ?", [$id_user]);
      foreach ($value as $level) {
        $this->db->execute_query("INSERT INTO teacher_education_level (id_user, id_level) VALUES (?, ?)", [$id_user, $level->id]);
      }
    }
  }

  $job = new EditProfile('PATCH', true, true);
	$job->request();
?>
