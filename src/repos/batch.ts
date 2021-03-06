import Repository from './base';
import { SQL, SimpleSQLBuilder } from '../utils/db';
import { Batch } from '../models/batch';
import { ISSUED } from '../commons/setting';
import { Sqlite } from '../utils/sqlite';


class BatchRepository extends Repository<Batch> {
    constructor() {
        super();
        this.loadQueries();
    }

    protected override convertToEntity(result: any): Batch | null {
        if (!result) return null;
        return {
            regNo: result['reg_no'],
            onChainId: result['on_chain_id'],
            group: result['group_id'],
            creator: result['creator_id'],
            issued: (result['issued'] as number) == ISSUED,
            certificates: []
        };
    }

    protected override async loadQueries() {
        this.addQuery(
            'findByBatchRegNo',
            SimpleSQLBuilder.new()
                .select('batches')
                .by('reg-no')
                .build()
        );
        this.addQuery(
            'findByGroupId',
            SimpleSQLBuilder.new()
                .select('batches')
                .by('group-id')
                .build()
        );
        this.addQuery(
            'findByBatchRegNoAndIssued',
            SimpleSQLBuilder.new()
                .select('batches')
                .by('reg-no')
                .and('issued')
                .build()
        );
        this.addQuery(
            'findConfirmersByBatchRegNo',
            SimpleSQLBuilder.new()
                .select('batch-confirmers')
                .by('batch-reg-no')
                .and('confirmed', 'not-pending')
                .build()
        );
        this.addQuery(
            'create',
            SimpleSQLBuilder.new()
                .insert('batches')
                .with('reg-no', 'group-id', 'creator')
                .build()
        );
        this.addQuery(
            'updateOnChainIdByBatchRegNo',
            SimpleSQLBuilder.new()
                .update('batches')
                .with('on-chain-id')
                .by('reg-no')
                .build()
        );
        this.addQuery(
            'confirm',
            SimpleSQLBuilder.new()
                .insert('batch-confirmers')
                .with('batch-reg-no', 'confirmer-id', 'confirmed')
                .build()
        );
        this.addQuery(
            'updateConfirmation',
            SimpleSQLBuilder.new()
                .update('batch-confirmers')
                .with('pending')
                .by('batch-reg-no', 'confirmer-id')
                .build()
        );
        this.addQuery(
            'updateIssuanceByBatchRegNo',
            SimpleSQLBuilder.new()
                .update('batches')
                .with('issued')
                .by('reg-no')
                .build()
        );
    }

    async findByBatchRegNo(regNo: string, db?: Sqlite) {
        const query = this.getQuery('findByBatchRegNo');
        const result = await (db || this.db)?.get(query, [regNo]);
        return this.convertToEntity(result);
    }

    async findByGroupId(groupId: number, db?: Sqlite) {
        const query = this.getQuery('findByGroupId');
        const result = await (db || this.db)?.all(query, [groupId]);
        return result?.map((r: any) => this.convertToEntity(r)) as Batch[];
    }

    async findByBatchRegNoAndIssued(regNo: string, db?: Sqlite) {
        const query = this.getQuery('findByBatchRegNoAndIssued');
        const result = await (db || this.db)?.get(query, [regNo]);
        return this.convertToEntity(result);
    }

    async findConfirmersByBatchRegNo(regNo: string, db?: Sqlite) {
        const query = this.getQuery('findConfirmersByBatchRegNo');
        const result = await (db || this.db)?.all(query, [regNo]);
        return result?.map((r: any) => r['confirmer_id'] as string) as string[];
    }

    async create(batch: Batch, db?: Sqlite) {
        const query = this.getQuery('create');
        await (db || this.db)?.run(query, [batch.regNo, batch.group, batch.creator]);
    }

    async confirm(regNo: string, confirmerId: string, confirmed: number, db?: Sqlite) {
        const query = this.getQuery('confirm');
        await (db || this.db)?.run(query, [regNo, confirmerId, confirmed]);
    }

    async updateConfirmation(regNo: string, confirmerId: string, confirmation: number, db?: Sqlite) {
        const query = this.getQuery('updateConfirmation');
        await (db || this.db)?.run(query, [confirmation, regNo, confirmerId]);
    }

    async updateIssuance(regNo: string, issued: number, db?: Sqlite) {
        const query = this.getQuery('updateIssuanceByBatchRegNo');
        await (db || this.db)?.run(query, [issued, regNo]);
    }

    async updateOnChainId(regNo: string, onChainId: number, db?: Sqlite) {
        const query = this.getQuery('updateOnChainIdByBatchRegNo');
        await (db || this.db)?.run(query, [onChainId, regNo]);
    }
}

export default new BatchRepository();