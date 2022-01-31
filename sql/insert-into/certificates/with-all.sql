insert into certificates (
    reg_no,
    batch_reg_no,
    on_chain_id,
    conferred_on,
    date_of_birth,
    year_of_graduation,
    major_in,
    degree_of,
    degree_classification,
    mode_of_study,
    created_in,
    created_at
) values (
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    current_timestamp
);