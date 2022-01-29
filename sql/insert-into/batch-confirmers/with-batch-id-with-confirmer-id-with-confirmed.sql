insert into batch_confirmers (batch_id, confirmer_id, confirmed, created_at)
values (?, lower(?), ?, current_timestamp);