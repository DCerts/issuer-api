create table if not exists batch_confirmers (
    batch_id integer not null,
    confirmer_id text not null,
    -- foreign key (batch_id) references batches(batch_id),
    -- foreign key (confirmer_id) references accounts(account_id),
    -- primary key (batch_id, confirmer_id),
    confirmed boolean default false,
    pending boolean default true,
    created_at timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);