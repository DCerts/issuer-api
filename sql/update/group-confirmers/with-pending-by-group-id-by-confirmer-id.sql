update group_confirmers
set pending = ?, updated_at = current_timestamp
where group_id = ?
and confirmer_id = lower(?);