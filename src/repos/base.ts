import DB, { connect } from '../utils/db';
import logger from '../utils/logger';
import { SPACE, EMPTY, NEWLINE_REGEX } from '../commons/str';
import { Sqlite } from '../utils/sqlite';


abstract class Repository<T> {
    protected db: Sqlite | undefined;
    protected queries: Map<string, string>;

    protected constructor() {
        this.init();
        this.queries = new Map<string, string>();
    }

    private async init() {
        await connect();
        this.db = DB.get();
    }

    protected addQuery(name: string, sql: string) {
        this.queries.set(name, sql);
    }

    protected getQuery(name: string): string {
        return this.queries.get(name) || EMPTY;
    }

    protected abstract convertToEntity(result: any): T | null;
    protected abstract loadQueries(): void;
}

export default Repository;