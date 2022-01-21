update subjects
set subject_name = ?, description = ?, updated_at = current_timestamp
where subject_id = ?;