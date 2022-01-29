import Repository from './base';
import { SQL, SimpleSQLBuilder } from '../utils/db';
import { Batch } from '../models/batch';
import { ISSUED } from '../commons/setting';


class BatchRepository extends Repository<Batch> {
    constructor() {
        super();
        this.loadQueries();
    }

    protected override convertToEntity(result: any): Batch | null {
        if (!result) return null;
        return {
            id: result['batch_id'],
            name: result['batch_name'],
            group: result['group_id'],
            creator: result['creator_id'],
            issued: (result['issued'] as number) == ISSUED,
            certificates: []
        };
    }

    protected override async loadQueries() {
        this.addQuery(
            'findByBatchId',
            SimpleSQLBuilder.new()
                .select('batches')
                .by('id')
                .build()
        );
        this.addQuery(
            'findByBatchIdAndIssued',
            SimpleSQLBuilder.new()
                .select('batches')
                .by('id')
                .and('issued')
                .build()
        );
        this.addQuery(
            'findConfirmersByBatchId',
            SimpleSQLBuilder.new()
                .select('batch-confirmers')
                .by('batch-id')
                .and('confirmed', 'not-pending')
                .build()
        );
        this.addQuery(
            'create',
            SimpleSQLBuilder.new()
                .insert('batches')
                .with('id', 'name', 'group-id', 'creator')
                .build()
        );
        this.addQuery(
            'confirm',
            SimpleSQLBuilder.new()
                .insert('batch-confirmers')
                .with('batch-id', 'confirmer-id', 'confirmed')
                .build()
        );
        this.addQuery(
            'updateConfirmation',
            SimpleSQLBuilder.new()
                .update('batch-confirmers')
                .with('pending')
                .by('batch-id', 'confirmer-id')
                .build()
        );
        this.addQuery(
            'updateIssuance',
            SimpleSQLBuilder.new()
                .update('batches')
                .with('issued')
                .by('id')
                .build()
        );
    }

    async findByBatchId(batchId: number) {
        const query = this.getQuery('findByBatchId');
        const result = await this.db?.get(query, [batchId]);
        return this.convertToEntity(result);
    }

    async findByBatchIdAndIssued(batchId: number) {
        const query = this.getQuery('findByBatchIdAndIssued');
        const result = await this.db?.get(query, [batchId]);
        return this.convertToEntity(result);
    }

    async findConfirmersByBatchId(batchId: number) {
        const query = this.getQuery('findConfirmersByBatchId');
        const result = await this.db?.all(query, [batchId]);
        return result?.map((r: any) => r['confirmer_id'] as string) as string[];
    }

    async create(batch: Batch) {
        const query = this.getQuery('create');
        await this.db?.run(query, [batch.id, batch.name, batch.group, batch.creator]);
    }

    async confirm(batchId: number, confirmerId: string, confirmed: number) {
        const query = this.getQuery('confirm');
        await this.db?.run(query, [batchId, confirmerId, confirmed]);
    }

    async updateConfirmation(batchId: number, confirmerId: string, confirmation: number) {
        const query = this.getQuery('updateConfirmation');
        await this.db?.run(query, [confirmation, batchId, confirmerId]);
    }

    async updateIssuance(batchId: number, issued: number) {
        const query = this.getQuery('updateIssuance');
        await this.db?.run(query, [issued, batchId]);
    }
}

export default new BatchRepository();