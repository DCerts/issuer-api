select c.*, b.issued
from certificates as c
left join batches as b
on c.batch_id = b.batch_id
where c.reg_no = ?;