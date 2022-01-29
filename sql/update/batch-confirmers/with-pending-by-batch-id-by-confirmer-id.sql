update batch_confirmers
set pending = ?, updated_at = current_timestamp
where batch_id = ?
and confirmer_id = lower(?);