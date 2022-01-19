select *
from group_confirmers
where group_id = ?
and confirmed = 1
and pending = 0;