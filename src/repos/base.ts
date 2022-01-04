import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import DB, { connect } from '../utils/db';


class Repository {
    protected db: Database<sqlite3.Database, sqlite3.Statement> | undefined;

    protected constructor() {
        this.init();
    }

    private async init() {
        await connect();
        this.db = DB.get();
    }
}

export default Repository;