create table if not exists certificates (
    certificate_id integer primary key,
    batch_id integer not null,
    student_id text not null,
    subject_id text not null,
    semester text not null,
    grade text not null,
    grade_type not null,
    issued boolean default false,
    -- foreign key (batch_id) references batches(batch_id),
    -- foreign key (student_id) references students(student_id),
    -- foreign key (subject_id) references subjects(subject_id),
    created_at timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false
);