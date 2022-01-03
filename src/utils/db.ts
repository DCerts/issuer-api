import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';


sqlite3.verbose();

let instance: Database<sqlite3.Database, sqlite3.Statement>;

const connect = async () => {
    if (!instance) {
        instance = await open({
            filename: '.db',
            driver: sqlite3.Database
        });
    }
    return instance;
};

const close = async () => {
    await instance?.close();
}

export default {
    connect: connect,
    close: close
};