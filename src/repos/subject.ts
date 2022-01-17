import Repository from './base';
import { SQL, SimpleSQLBuilder } from '../utils/db';
import { Subject } from '../models/subject';


class SubjectRepository extends Repository<Subject> {
    constructor() {
        super();
        this.loadQueries();
    }

    protected override convertToEntity(result: any): Subject | null {
        if (!result) return null;
        return {
            id: result['subject_id'],
            name: result['subject_name'],
            description: result['description']
        };
    }

    protected override async loadQueries() {
        this.addQuery(
            'findById',
            SimpleSQLBuilder.new()
                .select('subjects')
                .by('id')
                .build()
        );
        this.addQuery(
            'updateById',
            SimpleSQLBuilder.new()
                .update('subjects')
                .with('name', 'description')
                .by('id')
                .build()
        );
        this.addQuery(
            'create',
            SimpleSQLBuilder.new()
                .insert('subjects')
                .with('id', 'name', 'description')
                .build()
        );
    }

    async findById(id: string) {
        const query = this.getQuery('findById');
        const result = await this.db?.get(query, [id]);
        return this.convertToEntity(result);
    }

    async updateById(id: string, subject: Subject) {
        const query = this.getQuery('updateById');
        await this.db?.run(query, [
            subject.name,
            subject.description,
            id
        ]);
    }

    async create(subject: Subject) {
        const query = this.getQuery('create');
        await this.db?.run(query, [
            subject.id,
            subject.name,
            subject.description
        ]);
    }
}

export default new SubjectRepository();