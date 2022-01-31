select *
from batch_confirmers
where batch_reg_no = ?
and confirmed = 1
and pending = 0;