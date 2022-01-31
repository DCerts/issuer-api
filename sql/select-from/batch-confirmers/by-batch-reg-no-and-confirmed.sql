select *
from batch_confirmers
where batch_reg_no = ?
and confirmed = 1;