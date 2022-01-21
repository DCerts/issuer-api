insert into accounts (account_id, full_name, birthday, email, role_id, created_at)
values (lower(?), ?, ?, ?, ?, current_timestamp);