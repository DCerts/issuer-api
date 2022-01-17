create table if not exists dbatches (
    dbatch_id integer primary key,
    batch_id integer not null,
    -- foreign key (batch_id) references batchs(batch_id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);