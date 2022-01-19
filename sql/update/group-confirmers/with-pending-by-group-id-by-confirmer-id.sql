update group_confirmers
set pending = ?
where group_id = ?
and confirmer_id = lower(?);