import Repository from './base';
import { SQL } from '../utils/db';
import { Subject } from '../models/subject';


class SubjectRepository extends Repository {
    private findBySubjectIdSQL: string;
    private createWithSubjectIdSQL: string;
    private createWithSubjectIdAndNameAndDescriptionSQL: string;
    private saveBySubjectIdSQL: string;

    constructor() {
        super();
        this.findBySubjectIdSQL = SQL.from('select-from/subjects/by-subject-id.sql').build();
        this.createWithSubjectIdSQL = SQL.from('insert-into/subjects/with-subject-id.sql').build();
        this.createWithSubjectIdAndNameAndDescriptionSQL = SQL.from('insert-into/subjects/with-subject-id-with-name-with-description.sql').build();
        this.saveBySubjectIdSQL = SQL.from('update/subjects/by-subject-id-with-name-with-description.sql').build();
    }

    async findBySubjectId(subjectId: string) {
        const result = await this.db?.get(this.findBySubjectIdSQL, [subjectId]);
        if (result) {
            return {
                id: result['subject_id'],
                name: result['name'],
                email: result['description']
            };
        }
    }

    async create(subject: Subject) {
        await this.db?.run(
            this.createWithSubjectIdAndNameAndDescriptionSQL,
            [subject.id, subject.name, subject.description]
        );
    }

    async save(subject: Subject) {
        await this.db?.run(
            this.saveBySubjectIdSQL,
            [subject.name, subject.description, subject.id]
        );
    }
}

export default new SubjectRepository();