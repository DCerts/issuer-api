import fs from 'fs';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';


sqlite3.verbose();

class SQLBuilder {
    private sql: string;

    constructor(sql: string) {
        this.sql = sql;
    }

    /**
     * Return the SQL string from the wrapper.
     * @returns the sql string
     * @see SQL
     */
    build(): string {
        return this.sql;
    }
}

/**
 * A class for reading SQL from files.
 */
class SQL {
    private static ROOT_RESOURCE: string | undefined;

    static from(file: string): SQLBuilder {
        return new SQLBuilder(
            fs.readFileSync(
                SQL.ROOT_RESOURCE ? SQL.ROOT_RESOURCE + file : file,
                'utf8'
            )
        );
    }

    /**
     * Specify the root resource for reading SQL files.
     * @param path the path to the root resource
     */
    static withRootResource(path: string) {
        SQL.ROOT_RESOURCE = path;
    }

    static getRootResource() {
        return SQL.ROOT_RESOURCE;
    }
}

/**
 * A wrapper for SQLite3's Database class.
 */
class DB {
    private static INSTANCE: Database<sqlite3.Database, sqlite3.Statement>;

    static async connect(file: string) {
        if (!DB.INSTANCE) {
            DB.INSTANCE = await open({
                filename: file,
                driver: sqlite3.Database
            });
        }
        return DB.INSTANCE;
    }

    static async close() {
        if (DB.INSTANCE) {
            await DB.INSTANCE?.close();
        }
    }

    static get() {
        return DB.INSTANCE;
    }
}

/**
 * Creates tables if they don't exist on the database.
 * @param tables the tables to create.
 */
const createTables = async (...tables: string[]) => {
    for (const table of tables) {
        const sql = SQL.from(`create-table/${table}.sql`).build();
        await DB.get().run(sql);
    }
};

/**
 * Connect to in-memory database with default settings.
 */
const connect = async () => {
    SQL.withRootResource('./sql/');
    await DB.connect('.db');
};

export default DB;
export {
    SQL, createTables, connect
};