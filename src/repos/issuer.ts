import { Issuer } from '../entities/issuer';
import db from '../utils/db';


const getIssuer = async (id: string) => {
    const instance = await db.connect();
    const sql = `SELECT Id id, Name name, Email email `
        + ` FROM Issuers WHERE Id = ? `;
    const issuer = await instance.get(sql, [id]);
    return {
        id: issuer?.id,
        name: issuer?.name,
        email: issuer?.email,
        school: issuer?.school
    };
};

const insertIssuer = async (issuer: Issuer) => {
    const instance = await db.connect();
    const sql = `INSERT INTO Issuers (Id, Name, Email)`
        + ` VALUES (?, ?, ?) `;
    await instance.run(sql, [
        issuer.id,
        issuer.name,
        issuer.email
    ]);
};

const updateIssuer = async (issuer: Issuer) => {
    const instance = await db.connect();
    const sql = `UPDATE Issuers`
        + ` SET Name = ?, Email = ? `
        + ` WHERE Id = ? `;
    await instance.run(sql, [
        issuer.name,
        issuer.email,
        issuer.id
    ]);
};

const hasIssuerExisted = async (id: string) => {
    const instance = await db.connect();
    const sql = `SELECT COUNT(*) <> 0 AS existed`
        + ` FROM Issuers `
        + ` WHERE Id = ? `;
    return (await instance.get(sql, [id]))?.existed == 1;
};

const saveIssuer = async (issuer: Issuer) => {
    const existed = await hasIssuerExisted(issuer.id);
    if (existed) await updateIssuer(issuer);
    else await insertIssuer(issuer);
};

export {
    getIssuer,
    saveIssuer,
    insertIssuer,
    updateIssuer,
    hasIssuerExisted
};