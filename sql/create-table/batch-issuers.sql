create table if not exists batch_issuers (
    batch_id integer not null,
    issuer_id text not null,
    -- foreign key (batch_id) references batches(batch_id),
    -- foreign key (issuer_id) references accounts(account_id),
    -- primary key (batch_id, issuer_id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);