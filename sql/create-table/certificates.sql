create table if not exists certificates (
    certificate_id integer primary key,
    batch_id integer not null,
    reg_no text,
    conferred_on text not null,
    date_of_birth text,
    year_of_graduation integer,
    major_in text,
    degree_of text,
    degree_classification text,
    mode_of_study text,
    -- foreign key (batch_id) references batches(batch_id),
    created_in text,
    created_at timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);