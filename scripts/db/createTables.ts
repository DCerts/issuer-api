import db from '../../src/utils/db';


const createTables = async () => {
    const instance = await db.connect();
    const accounts = `CREATE TABLE IF NOT EXISTS Accounts (`
        + ` PublicAddress TEXT PRIMARY KEY, `
        + ` Nonce TEXT, `
        + ` IssuerId TEXT) `;
    const issuers = `CREATE TABLE IF NOT EXISTS Issuers (`
        + ` Id TEXT PRIMARY KEY, `
        + ` Name TEXT, `
        + ` Email TEXT, `
        + ` School TEXT) `;
    instance.run(accounts);
    instance.run(issuers);
};

export default createTables;