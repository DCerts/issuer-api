create table if not exists accounts (
    account_id text primary key,
    role_id integer not null default 1,
    full_name text not null,
    birthday date,
    email text not null,
    nonce text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);