create table if not exists students (
    id int auto_increment primary key,
    student_id text,
    full_name text,
    email text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);