create table if not exists issuers (
    public_address text primary key,
    full_name text,
    email text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);