create table if not exists accounts (
    id integer auto_increment,
    public_address text,
    nonce text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);