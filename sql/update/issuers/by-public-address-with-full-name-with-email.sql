update issuers
set full_name = ?,
    email = ?,
    updated_at = current_timestamp
where public_address = ?;