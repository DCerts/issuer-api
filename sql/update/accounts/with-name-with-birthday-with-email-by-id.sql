update accounts
set full_name = ?, birthday = ?, email = ?, updated_at = current_timestamp
where account_id = lower(?);