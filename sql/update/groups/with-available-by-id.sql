update groups
set available = ?, updated_at = current_timestamp
where group_id = ?;