select *
from group_confirmers
where confirmer_id = lower(?)
and confirmed = 1;