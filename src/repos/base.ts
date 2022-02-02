import DB, { DatabaseUtils } from '../utils/db';
import logger from '../utils/logger';
import { SPACE, EMPTY, NEWLINE_REGEX } from '../commons/str';
import { Sqlite } from '../utils/sqlite';
import { InternalServerError } from '../errors/http';
import { ErrorCode } from '../errors/code';


abstract class Repository<T> {
    protected db: Sqlite | undefined;
    protected queries: Map<string, string>;

    protected constructor() {
        this.init();
        this.queries = new Map<string, string>();
    }

    private async init() {
        await DatabaseUtils.connect();
        this.db = DB.get();
    }

    /**
     * Add an SQL query to the repository with the given key.
     * Should be called in the {@link loadQueries} method.
     * @param name the key of the query
     * @param sql the SQL query
     * @see loadQueries
     */
    protected addQuery(name: string, sql: string) {
        this.queries.set(name, sql);
    }

    /**
     * Get the SQL query with the given key.
     * @param name the key of the query
     * @returns the SQL query
     * @see addQuery
     */
    protected getQuery(name: string): string {
        const query = this.queries.get(name);
        if (!query) {
            throw new InternalServerError(EMPTY, ErrorCode.QUERY_NOT_FOUND);
        }
        return query;
    }

    /**
     * Convert the result of the query to the model of implemented repository.
     * @param result the result of the query
     */
    protected abstract convertToEntity(result: any): T | null;

    /**
     * Load all SQL queries to the repository.
     */
    protected abstract loadQueries(): void;
}

export default Repository;