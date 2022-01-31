select c.*, b.issued
from certificates as c
left join batches as b
on c.batch_reg_no = b.reg_no
where c.batch_reg_no = ?;