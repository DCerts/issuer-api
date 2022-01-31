update batch_confirmers
set pending = ?, updated_at = current_timestamp
where batch_reg_no = ?
and confirmer_id = lower(?);