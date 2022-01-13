create table if not exists groups (
    group_id integer primary key,
    threshold integer not null default 1,
    available boolean default false,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);