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
    private static SQL_EXTENSION: string = '.sql';

    /**
     * Read the SQL file from the root resource.
     * @see SQL.withRootResource
     * @param file the file name
     * @returns the SQL string from the file
     */
    static from(file: string): SQLBuilder {
        if (!file.endsWith(SQL.SQL_EXTENSION)) {
            file += SQL.SQL_EXTENSION;
        }
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

    static getExtension() {
        return SQL.SQL_EXTENSION;
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

const createAllTables = async () => {
    const dir = SQL.getRootResource() + 'create-table';
    const files = fs.readdirSync(dir);
    const tables = [];
    for (const file of files) {
        if (file.endsWith(SQL.getExtension())) {
            const table = file.replace(SQL.getExtension(), '');
            tables.push(table);
        }
    }
    await createTables(...tables);
};

/**
 * Connect to in-memory database with default settings.
 */
const connect = async () => {
    SQL.withRootResource('./sql/');
    await DB.connect('.db');
};

enum SimpleSQLAction {
    SELECT = 'select-from',
    INSERT = 'insert-into',
    UPDATE = 'update',
    DELETE = 'delete-from'
}

enum SimpleSQLKeyword {
    WITH = 'with',
    BY = 'by'
}

/**
 * Simple Builder with common methods.
 * The file structure is:
 *     ${ROOT_RESOURCE}/${ACTION}/${TABLE}/${KEYWORD}-${COLUMN}.sql
 * @see SQL
 */
class SimpleSQLBuilder {
    private static PATH_DELIMITER: string = '/';
    private static WORD_DELIMITER: string = '-';

    private table: string | undefined;
    private action: SimpleSQLAction | undefined;
    private columns: Map<SimpleSQLKeyword, string[]>;

    constructor() {
        this.columns = new Map<SimpleSQLKeyword, string[]>();
    }

    static new(): SimpleSQLBuilder {
        return new SimpleSQLBuilder();
    }

    /**
     * @see SQL.from
     * @returns the SQL string
     */
    build(): string {
        const pathDelimiter = SimpleSQLBuilder.PATH_DELIMITER;
        const wordDelimiter = SimpleSQLBuilder.WORD_DELIMITER;
        let file = `${this.action}${pathDelimiter}${this.table}${pathDelimiter}`;
        this.columns.forEach((columns, keyword) => {
            file += keyword + wordDelimiter
                + columns.join(wordDelimiter + keyword + wordDelimiter)
                + wordDelimiter;
        });
        if (file.endsWith(wordDelimiter)) {
            file = file.substring(0, file.length - wordDelimiter.length);
        }
        return SQL.from(file).build();
    }

    select(table: string): SimpleSQLBuilder {
        this.table = table;
        this.action = SimpleSQLAction.SELECT;
        return this;
    }

    insert(table: string): SimpleSQLBuilder {
        this.table = table;
        this.action = SimpleSQLAction.INSERT;
        return this;
    }

    update(table: string): SimpleSQLBuilder {
        this.table = table;
        this.action = SimpleSQLAction.UPDATE;
        return this;
    }

    // For SET clause
    with(...columns: string[]): SimpleSQLBuilder {
        this.columns.set(SimpleSQLKeyword.WITH, columns);
        return this;
    }

    // For WHERE clause
    by(...columns: string[]): SimpleSQLBuilder {
        this.columns.set(SimpleSQLKeyword.BY, columns);
        return this;
    }
}

export default DB;
export {
    SQL, createTables, createAllTables, connect,
    SimpleSQLBuilder
};