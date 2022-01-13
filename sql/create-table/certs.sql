create table if not exists certs (
    cert_id text primary key,
    student_id text,
    subject_id text,
    semester text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp,
    deleted boolean default false,
    foreign key (student_id) references students(student_id),
    foreign key (subject_id, semester) references subjects(subject_id, semester)
);