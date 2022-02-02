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
            regNo: result['reg_no'],
            group: result['group_id'],
            onChainId: result['on_chain_id'],
            batchRegNo: result['batch_reg_no'],
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
            'findByOnChainId',
            SimpleSQLBuilder.new()
                .select('certificates')
                .by('on-chain-id')
                .build()
        );
        this.addQuery(
            'findByBatchRegNo',
            SimpleSQLBuilder.new()
                .select('certificates')
                .by('batch-reg-no')
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
            'findByGroupId',
            SimpleSQLBuilder.new()
                .select('certificates')
                .by('group-id')
                .build()
        );
        this.addQuery(
            'create',
            SimpleSQLBuilder.new()
                .insert('certificates')
                .with('all')
                .build()
        );
        this.addQuery(
            'updateOnChainIdByRegNo',
            SimpleSQLBuilder.new()
                .update('certificates')
                .with('on-chain-id')
                .by('reg-no')
                .build()
        );
    }

    async findByOnChainId(onChainId: number) {
        const query = this.getQuery('findByOnChainId');
        const result = await this.db?.get(query, [onChainId]);
        return this.convertToEntity(result);
    }

    async findByRegNo(regNo: string) {
        const query = this.getQuery('findByRegNo');
        const result = await this.db?.get(query, [regNo]);
        return this.convertToEntity(result);
    }

    async findByGroupId(groupId: number) {
        const query = this.getQuery('findByGroupId');
        const result = await this.db?.all(query, [groupId]);
        return result?.map(this.convertToEntity) as Certificate[];
    }

    async findByBatchRegNo(batchRegNo: string) {
        const query = this.getQuery('findByBatchRegNo');
        const result = await this.db?.all(query, [batchRegNo]);
        return result?.map(this.convertToEntity) as Certificate[];
    }

    async create(certificate: Certificate) {
        const query = this.getQuery('create');
        await this.db?.run(query, [
            certificate.regNo,
            certificate.group,
            certificate.batchRegNo,
            certificate.onChainId,
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

    async updateOnChainIdByRegNo(regNo: string, onChainId: number) {
        const query = this.getQuery('updateOnChainIdByRegNo');
        await this.db?.all(query, [onChainId, regNo]);
    }
}

export default new CertificateRepository<any>();