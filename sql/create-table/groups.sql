create table if not exists groups (
    group_id integer primary key,
    group_name text not null,
    threshold integer not null default 1,
    available boolean default false,
    creator_id text not null,
    -- foreign key(creator_id) references accounts(account_id),
    created_at timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);