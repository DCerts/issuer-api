create table if not exists cert_issuers (
    cert_id text,
    issuer_id text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false,
    primary key (cert_id, issuer_id),
    foreign key (cert_id) references certs(cert_id),
    foreign key (issuer_id) references issuers(issuer_id)
);