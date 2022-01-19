update accounts
set nonce = ?
where account_id = lower(?);