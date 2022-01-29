select *
from batches
where batch_id = ?
and issued = 1;