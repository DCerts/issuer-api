create table if not exists issuers (
    id int auto_increment primary key,
    public_address text,
    full_name text,
    email text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);