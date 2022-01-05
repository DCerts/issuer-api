create table if not exists cert_issuers (
    id integer auto_increment,
    cert_id text,
    issuer_id text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);