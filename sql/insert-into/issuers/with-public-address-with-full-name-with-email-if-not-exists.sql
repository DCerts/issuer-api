insert into issuers (public_address, full_name, email)
select * from (? as public_address, ? as full_name, ? as email) as tmp
where not exists (
    select 1
    from issuers
    where public_address = ?
);