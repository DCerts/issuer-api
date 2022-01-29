select *
from batch_confirmers
where batch_id = ?
and confirmed = 1;