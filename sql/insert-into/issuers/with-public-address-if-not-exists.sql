insert into issuers (public_address)
select * from (? as public_address) as tmp
where not exists (
    select 1
    from issuers
    where public_address = ?
);