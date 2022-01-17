import Repository from './base';
import { SQL, SimpleSQLBuilder } from '../utils/db';
import { NewsDatum, NewsType } from '../models/news';


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
            'findByAccountId',
            SimpleSQLBuilder.new()
                .select('news')
                .by('account-id')
                .build()
        );
    }

    async findByAccountId(accountId: string) {
        const query = this.getQuery('findByAccountId');
        const result = await this.db?.all(query, [accountId]);
        return result?.map(this.convertToEntity) as NewsDatum<T>[];
    }
}

export default new NewsRepository<any>();