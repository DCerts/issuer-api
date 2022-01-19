select *
from accounts
where account_id = lower(?)
and deleted = false;