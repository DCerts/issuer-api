select *
from batch_confirmers
where confirmer_id = lower(?)
and confirmed = 1;