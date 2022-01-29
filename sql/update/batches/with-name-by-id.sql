update batches
set batch_name = ?, updated_at = current_timestamp
where batch_id = ?;