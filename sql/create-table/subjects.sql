create table if not exists subjects (
    subject_id text primary key,
    subject_name text not null,
    description text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);