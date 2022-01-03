import db from '../utils/db';
import * as issuer from './issuer';


const getNonce = async (publicAddress: string) => {
    const instance = await db.connect();
    const sql = `SELECT Nonce nonce FROM Accounts WHERE PublicAddress = ?`;
    const row = await instance.get(sql, [publicAddress]);
    return row?.nonce;
};

const hasAccountExisted = async (publicAddress: string) => {
    const instance = await db.connect();
    const sql = `SELECT COUNT(*) <> 0 existed FROM Accounts WHERE PublicAddress = ?`;
    return (await instance.get(sql, [publicAddress]))?.existed == 1;
};

const updateNonce = async (publicAddress: string, nonce: string) => {
    const instance = await db.connect();
    const sql = `UPDATE Accounts SET Nonce = ? WHERE PublicAddress = ?`;
    await instance.run(sql, [nonce, publicAddress]);
};

const insertNonce = async (publicAddress: string, nonce: string) => {
    const instance = await db.connect();
    const sql = `INSERT INTO Accounts (PublicAddress, Nonce)`
        + ` VALUES (?, ?) `;
    await instance.run(sql, [publicAddress, nonce]);
};

const saveNonce = async (publicAddress: string, nonce: string) => {
    if (await hasAccountExisted(publicAddress)) {
        await updateNonce(publicAddress, nonce);
    }
    else {
        await insertNonce(publicAddress, nonce);
        await issuer.insertIssuer({
            id: publicAddress,
            name: null,
            email: null,
            school: null,
            groups: []
        });
    }
};

const hasAccountWithNonceExisted = async (publicAddress: string, nonce: string) => {
    const instance = await db.connect();
    const sql = `SELECT COUNT(*) <> 0 existed`
        + ` FROM Accounts `
        + ` WHERE PublicAddress = ? `
        + ` AND Nonce = ? `;
    return (await instance.get(sql, [publicAddress, nonce]))?.existed == 1;
};

export {
    getNonce,
    saveNonce,
    insertNonce,
    updateNonce,
    hasAccountExisted,
    hasAccountWithNonceExisted
};