import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import DB, { connect } from '../utils/db';


abstract class Repository {
    protected db: Database<sqlite3.Database, sqlite3.Statement> | undefined;
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
        return this.queries.get(name) || '';
    }

    protected abstract loadQueries(): void;
}

export default Repository;