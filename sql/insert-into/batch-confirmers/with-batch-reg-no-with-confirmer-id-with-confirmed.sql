insert into batch_confirmers (batch_reg_no, confirmer_id, confirmed, created_at)
values (?, lower(?), ?, current_timestamp);