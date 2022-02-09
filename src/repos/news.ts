import Repository from './base';
import { SQL, SimpleSQLBuilder } from '../utils/db';
import { NewsDatum, NewsType } from '../models/news';
import { Sqlite } from '../utils/sqlite';


class NewsRepository<T> extends Repository<NewsDatum<T>> {
    constructor() {
        super();
        this.loadQueries();
    }

    protected override convertToEntity(result: any): NewsDatum<T> | null {
        if (!result) return null;
        return {
            type: result['news_type'] as NewsType,
            datum: result['news_datum'] as T
        };
    }

    protected override async loadQueries() {
        this.addQuery(
            'findGroupCreatedNewsByAccountId',
            SimpleSQLBuilder.new()
                .select('news/group-created')
                .by('account-id')
                .build()
        );
        this.addQuery(
            'findBatchCreatedNewsByAccountId',
            SimpleSQLBuilder.new()
                .select('news/batch-created')
                .by('account-id')
                .build()
        );
    }

    async findGroupCreatedNewsByAccountId(accountId: string, db?: Sqlite) {
        const query = this.getQuery('findGroupCreatedNewsByAccountId');
        const result = await (db || this.db)?.all(query, [accountId]);
        return result?.map(this.convertToEntity) as NewsDatum<T>[];
    }

    async findBatchCreatedNewsByAccountId(accountId: string, db?: Sqlite) {
        const query = this.getQuery('findBatchCreatedNewsByAccountId');
        const result = await (db || this.db)?.all(query, [accountId, accountId]);
        return result?.map(this.convertToEntity) as NewsDatum<T>[];
    }
}

export default new NewsRepository<any>();