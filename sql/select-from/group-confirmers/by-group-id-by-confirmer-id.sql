select exists(
    select *
    from group_confirmers
    where group_id = ?
    and confirmer_id = lower(?)
) as existed;