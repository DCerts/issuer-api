create table if not exists batches (
    batch_id integer primary key,
    batch_name text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);