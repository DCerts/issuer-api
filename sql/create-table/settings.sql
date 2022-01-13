create table if not exists settings (
    setting_id integer primary key,
    setting_value text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);