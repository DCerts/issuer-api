select 'group_created' as news_type, group_id as news_datum
from groups
where group_id not in (
    select distinct gc.group_id
    from group_confirmers as gc
    left join groups as g
    on gc.group_id = gc.group_id
    where gc.confirmer_id = lower(?)
    and g.available = 0
)
and available = 0;