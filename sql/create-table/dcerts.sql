create table if not exists dcerts (
    dcert_id integer primary key,
    certificate_id integer not null,
    -- foreign key (certificate_id) references certificates(certificate_id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);