select 'batch_created' as news_type, reg_no as news_datum
from batches
where reg_no not in (
    select distinct bc.batch_reg_no
    from batch_confirmers as bc
    left join batches as b
    on bc.batch_reg_no = b.reg_no
    where bc.confirmer_id = lower(?)
    and b.issued = 0
)
and issued = 0;