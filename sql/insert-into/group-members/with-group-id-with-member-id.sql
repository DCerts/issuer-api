insert into group_members (group_id, member_id, created_at)
values (?, lower(?), current_timestamp);