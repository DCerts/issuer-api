select g.*
from groups as g
left join group_members as gm
on g.group_id = gm.group_id
where gm.member_id = lower(?)
and g.available = 1;