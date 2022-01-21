create table if not exists students (
    student_id text primary key,
    full_name text not null,
    birthday date,
    email text,
    created_at timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);