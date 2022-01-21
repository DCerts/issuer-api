insert into groups (group_id, group_name, threshold, creator_id, created_at)
values (?, ?, ?, lower(?), current_timestamp);