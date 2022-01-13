insert into students (student_id)
select * from (? as student_id) as tmp
where not exists (
    select 1
    from students
    where student_id = ?
);