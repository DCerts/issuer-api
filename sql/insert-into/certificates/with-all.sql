insert into certificates (
    certificate_id,
    batch_id,
    reg_no,
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