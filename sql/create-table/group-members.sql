create table if not exists group_members (
    group_id integer not null,
    member_id text not null,
    -- foreign key (group_id) references groups(group_id),
    -- foreign key (member_id) references accounts(account_id),
    -- primary key (group_id, account_id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);