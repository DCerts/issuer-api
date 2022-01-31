create table if not exists batches (
    reg_no text primary key,
    on_chain_id integer,
    group_id integer not null,
    creator_id text not null,
    issued boolean default false,
    -- foreign key (creator_id) references accounts(account_id),
    -- foreign key (group_id) references groups(group_id),
    created_at timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);