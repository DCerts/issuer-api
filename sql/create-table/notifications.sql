create table if not exists notifications (
    notification_id integer primary key,
    account_id text not null,
    title integer not null,
    content_type text not null,
    content text,
    created_at timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);