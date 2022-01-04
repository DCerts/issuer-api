import { Cert } from '../entities/cert';
import db from '../utils/db';


const getCert = async (id: string) => {
    const instance = await db.connect();
    const sql = `SELECT Id id, Name name, Email email, SchoolId school `
        + ` FROM Certs WHERE Id = ? `;
    const cert = await instance.get(sql, [id]);
    return {
        id: cert?.id,
        name: cert?.name,
        email: cert?.email,
        school: cert?.school
    };
};

const createCert = async (cert: Cert) => {
    const instance = await db.connect();
    const sql = `INSERT INTO Certs (Id, SchoolId, StudentId, SubjectId, Semester, Grade, GradeType, BatchId)`
        + ` VALUES (?, ?, ?, ?, ?, ?, ?, ?) `;
    await instance.run(sql, [
        cert.id,
        cert.school,
        cert.student,
        cert.subject,
        cert.semester,
        cert.grade,
        cert.gradeType,
        cert.batch
    ]);
};

const updateCert = async (cert: Cert) => {
    const instance = await db.connect();
    const sql = `UPDATE Certs`
        + ` SET SchoolId = ?, StudentId = ?, SubjectId = ?, Semester = ?, Grade = ?, GradeType = ?, BatchId = ? `
        + ` WHERE Id = ? `;
    await instance.run(sql, [
        cert.school,
        cert.student,
        cert.subject,
        cert.semester,
        cert.grade,
        cert.gradeType,
        cert.batch,
        cert.id
    ]);
};

const hasCertExisted = async (id: string) => {
    const instance = await db.connect();
    const sql = `SELECT COUNT(*) <> 0 AS existed`
        + ` FROM Certs `
        + ` WHERE Id = ? `;
    return (await instance.get(sql, [id]))?.existed == 1;
};

export {
    getCert,
    createCert,
    updateCert,
    hasCertExisted
};