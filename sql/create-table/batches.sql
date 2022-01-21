create table if not exists batches (
    batch_id integer primary key,
    batch_name text not null,
    group_id integer not null,
    issued boolean default false,
    -- foreign key (group_id) references groups(group_id),
    created_at timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);