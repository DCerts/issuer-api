select *
from accounts
where account_id = ?
and deleted = false;