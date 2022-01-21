update accounts
set nonce = ?, updated_at = current_timestamp
where account_id = lower(?);