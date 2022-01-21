insert into group_confirmers (group_id, confirmer_id, confirmed, created_at)
values (?, lower(?), ?, current_timestamp);