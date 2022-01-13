import Repository from './base';
import { SQL } from '../utils/db';
import { Student } from '../models/student';


class StudentRepository extends Repository {
    private findByStudentIdSQL: string;
    private createWithStudentIdSQL: string;
    private createWithStudentIdAndFullNameAndEmailSQL: string;
    private saveByStudentIdSQL: string;

    constructor() {
        super();
        this.findByStudentIdSQL = SQL.from('select-from/students/by-student-id.sql').build();
        this.createWithStudentIdSQL = SQL.from('insert-into/students/with-student-id.sql').build();
        this.createWithStudentIdAndFullNameAndEmailSQL = SQL.from('insert-into/students/with-student-id-with-full-name-with-email.sql').build();
        this.saveByStudentIdSQL = SQL.from('update/students/by-student-id-with-full-name-with-email.sql').build();
    }

    async findByStudentId(studentId: string) {
        const result = await this.db?.get(this.findByStudentIdSQL, [studentId]);
        if (result) {
            return {
                id: result['student_id'],
                name: result['full_name'],
                email: result['email']
            };
        }
    }

    async create(student: Student) {
        await this.db?.run(
            this.createWithStudentIdAndFullNameAndEmailSQL,
            [student.id, student.name, student.email]
        );
    }

    async save(student: Student) {
        await this.db?.run(
            this.saveByStudentIdSQL,
            [student.name, student.email, student.id]
        );
    }
}

export default new StudentRepository();