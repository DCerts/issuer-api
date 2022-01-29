import Repository from './base';
import { SQL, SimpleSQLBuilder } from '../utils/db';
import { Certificate } from '../models/certificate';
import { ISSUED } from '../commons/setting';


class CertificateRepository<T> extends Repository<Certificate> {
    constructor() {
        super();
        this.loadQueries();
    }

    protected override convertToEntity(result: any): Certificate | null {
        if (!result) return null;
        return {
            id: result['certificate_id'],
            batchId: result['batch_id'],
            regNo: result['reg_no'],
            conferredOn: result['conferred_on'],
            dateOfBirth: result['date_of_birth'],
            yearOfGraduation: result['year_of_graduation'],
            majorIn: result['major_in'],
            degreeOf: result['degree_of'],
            degreeClassification: result['degree_classification'],
            modeOfStudy: result['mode_of_study'],
            createdIn: result['created_in'],
            createdAt: result['created_at'],
            issued: (result['issued'] as number) == ISSUED
        };
    }

    protected override async loadQueries() {
        this.addQuery(
            'findById',
            SimpleSQLBuilder.new()
                .select('certificates')
                .by('id')
                .build()
        );
        this.addQuery(
            'findByBatchId',
            SimpleSQLBuilder.new()
                .select('certificates')
                .by('batch-id')
                .build()
        );
        this.addQuery(
            'findByRegNo',
            SimpleSQLBuilder.new()
                .select('certificates')
                .by('reg-no')
                .build()
        );
        this.addQuery(
            'create',
            SimpleSQLBuilder.new()
                .insert('certificates')
                .with('all')
                .build()
        );
    }

    async findById(id: number) {
        const query = this.getQuery('findById');
        const result = await this.db?.get(query, [id]);
        return this.convertToEntity(result);
    }

    async findByBatchId(batchId: number) {
        const query = this.getQuery('findByBatchId');
        const result = await this.db?.all(query, [batchId]);
        return result?.map(this.convertToEntity) as Certificate[];
    }

    async findByRegNo(regNo: string) {
        const query = this.getQuery('findByRegNo');
        const result = await this.db?.all(query, [regNo]);
        return result?.map(this.convertToEntity) as Certificate[];
    }

    async create(certificate: Certificate) {
        const query = this.getQuery('create');
        await this.db?.all(query, [
            certificate.id,
            certificate.batchId,
            certificate.regNo,
            certificate.conferredOn,
            certificate.dateOfBirth,
            certificate.yearOfGraduation,
            certificate.majorIn,
            certificate.degreeOf,
            certificate.degreeClassification,
            certificate.modeOfStudy,
            certificate.createdIn
        ]);
    }
}

export default new CertificateRepository<any>();