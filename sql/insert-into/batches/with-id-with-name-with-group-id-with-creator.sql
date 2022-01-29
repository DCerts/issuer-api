insert into batches (batch_id, batch_name, group_id, creator_id, created_at)
values (?, ?, ?, lower(?), current_timestamp);