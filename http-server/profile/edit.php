<?php
	include '../classes/Request.php';

  class EditProfile extends Request {
    public function execute () {
      $email = $this->payload_token->email;
      $id_user = $this->payload_token->id;
      $role = $this->payload_token->role;
      $field = $this->body->field;
      $value = $this->body->value;

      if ($value === null || $value === '' || $field == null || $field == '') {
        return $this->send_message('Invalid data!!', 400);
      }

      # GET teacher, normal user don't will return
      $teacher = $this->db->execute_query('SELECT * FROM users u INNER JOIN teacher_information t on u.id = t.id_user where u.id = ? LIMIT 1', [$id_user]);

      # Insert teacher information
      if ($teacher->num_rows === 0 && $role === 1) {
        $this->db->execute_query("INSERT INTO teacher_information (id_user) VALUES (?)", [$id_user]);
      }

      switch ($field) {
        case 'about':
          $this->validate_role($role, 1);
          $this->update_about($value, $id_user); break;
        case 'location':
          $this->update_location($value, $id_user); break;
        case 'payment':
          $this->validate_role($role, 1);
          $this->update_payment($value, $id_user); break;
        case 'presencial':
          $this->validate_role($role, 1);
          $this->update_presencial($value, $id_user); break;
        case 'online':
          $this->validate_role($role, 1);
          $this->update_online($value, $id_user); break;
        case 'about-class':
          $this->validate_role($role, 1);
          $this->update_about_class($value, $id_user); break;
        case 'image':
          $this->update_image($value, $id_user); break;
        case 'subjects':
          $this->validate_role($role, 1);
          $this->update_subjects($value, $id_user); break;
        case 'level_education':
          $this->validate_role($role, 1);
          $this->update_levels_education($value, $id_user); break;
        default:
          throw new ServerException('Field doesn`t existe!', 404);
      }

      if ($role == 1) {
        $is_valid = 1;

        $info = $this->db->execute_query('SELECT * FROM teacher_information t WHERE t.id_user = ?', [$id_user]);
        $subjects = $this->db->execute_query('SELECT id FROM teacher_subjects t WHERE t.id_user = ?', [$id_user]);
        $education_level = $this->db->execute_query('SELECT id FROM teacher_education_level t WHERE t.id_user = ?', [$id_user]);

        if ($education_level->num_rows === 0) {
          $is_valid = 0;
        }

        if ($subjects->num_rows === 0) {
          $is_valid = 0;
        }

        $info = $info->fetch_assoc();
        foreach ($info as &$value) {
          if ($value === null) {
            $is_valid = 0;
          }
        }

        $this->db->execute_query("UPDATE teacher_information SET valid = ? WHERE id_user = ?", [$is_valid, $id_user]);
      }

      $this->send_message('Field changed successfully!', 200);
    }

    private function validate_role ($user_role, $necessary_role) {
      if ($user_role === $necessary_role) { return true; } else { throw new ServerException("Don't hash permission to edit this field", 400); return false; }
    }

    private function update_about ($value, $id_user) {
      $this->db->execute_query("UPDATE teacher_information SET description = ? WHERE id_user = ?", [$value, $id_user]);
    }

    private function update_location ($value, $id_user) {
      $this->db->execute_query("UPDATE users SET location_id = ? WHERE id = ? ", [$value, $id_user]);
    }

    private function update_payment ($value, $id_user) {
      $this->db->execute_query("UPDATE teacher_information SET hour_payment = ? WHERE id_user = ? ", [$value, $id_user]);
    }

    private function update_presencial ($value, $id_user) {
      $this->db->execute_query("UPDATE teacher_information SET presencial = ? WHERE id_user = ? ", [$value, $id_user]);
    }

    private function update_online ($value, $id_user) {
      $this->db->execute_query("UPDATE teacher_information SET online = ? WHERE id_user = ? ", [$value, $id_user]);
    }

    private function update_about_class ($value, $id_user) {
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
