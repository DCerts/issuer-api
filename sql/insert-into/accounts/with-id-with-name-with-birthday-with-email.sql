insert into accounts (account_id, full_name, birthday, email, created_at)
values (lower(?), ?, ?, ?, current_timestamp);