insert into batches (reg_no, group_id, creator_id, created_at)
values (?, ?, ?, lower(?), current_timestamp);