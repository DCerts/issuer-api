update batches
set issued = ?, updated_at = current_timestamp
where reg_no = ?;