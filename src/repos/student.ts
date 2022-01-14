import Repository from './base';
import { SQL, SimpleSQLBuilder } from '../utils/db';
import { Student } from '../models/student';


class StudentRepository extends Repository<Student> {
    constructor() {
        super();
        this.loadQueries();
    }

    override convertToEntity(result: any): Student | null {
        if (!result) return null;
        return {
            id: result['student_id'],
            name: result['full_name'],
            birthday: result['birthday'],
            email: result['email']
        };
    }

    override async loadQueries() {
        this.addQuery(
            'findById',
            SimpleSQLBuilder.new()
                .select('students')
                .by('id')
                .build()
        );
        this.addQuery(
            'updateById',
            SimpleSQLBuilder.new()
                .update('students')
                .with('name', 'birthday', 'email')
                .by('id')
                .build()
        );
        this.addQuery(
            'create',
            SimpleSQLBuilder.new()
                .insert('students')
                .with('id', 'name', 'birthday', 'email')
                .build()
        );
    }

    async findById(id: string) {
        const query = this.getQuery('findById');
        const result = await this.db?.get(query, [id]);
        return this.convertToEntity(result);
    }

    async updateById(id: string, student: Student) {
        const query = this.getQuery('updateById');
        await this.db?.run(query, [
            student.name,
            student.birthday,
            student.email,
            id
        ]);
    }

    async create(student: Student) {
        const query = this.getQuery('create');
        await this.db?.run(query, [
            student.id,
            student.name,
            student.birthday,
            student.email
        ]);
    }
}

export default new StudentRepository();