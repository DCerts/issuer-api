update students
set full_name = ?, birthday = ?, email = ?, updated_at = current_timestamp
where student_id = ?;