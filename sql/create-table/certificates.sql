create table if not exists certificates (
    reg_no text primary key,
    on_chain_id integer,
    batch_reg_no integer not null,
    conferred_on text not null,
    date_of_birth text,
    year_of_graduation integer,
    major_in text,
    degree_of text,
    degree_classification text,
    mode_of_study text,
    -- foreign key (batch_reg_no) references batches(reg_no),
    created_in text,
    created_at timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);