create table if not exists subjects (
    id auto_increment primary key,
    subject_id text,
    subject_name text,
    description text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);