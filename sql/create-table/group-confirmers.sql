create table if not exists group_confirmers (
    group_id integer not null,
    confirmer_id text not null,
    -- foreign key (group_id) references groups(group_id),
    -- foreign key (confirmer_id) references accounts(account_id),
    -- primary key (group_id, confirmer_id),
    confirmed boolean default false,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);